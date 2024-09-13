import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { AppDataSource } from '../config/data-source';
import { Link, User } from '../entities/';
import * as path from 'path';
import * as fs from 'fs';

const userRepository = AppDataSource.getRepository(User);
const linkRepository = AppDataSource.getRepository(Link);

const CERTS_PATH = path.resolve(__dirname, '..', './certificates');
const PRIVKEY = fs.readFileSync(`${CERTS_PATH}/slprivkey.pem`, { encoding: 'utf-8' }).trim();
const PUBKEY = fs.readFileSync(`${CERTS_PATH}/slpubkey.pem`, { encoding: 'utf-8' }).trim();

console.log(PUBKEY);
console.log(PRIVKEY);

class ApiService {
  static checkin = async (req: Request, res: Response) => {
    const { headers } = req;

    const toucherKey = headers['x-secondlife-toucher-key'] as string;
    const toucherName = headers['x-secondlife-toucher-name'] as string;

    console.log('Owner\nIP: %s\nKey: %s\nName: %s\n--------------------', req.ip.toString(), toucherKey, toucherName);

    try {
      if (!toucherName || !toucherKey) {
        res.status(400).json({ message: 'Missing data.', action: 'checkin' });
        return;
      }

      const foundUser = await userRepository.findOneBy({ uuid: toucherKey });

      if (foundUser) {
        const userId = foundUser.id;
        // We look up to see if there's any links for this user.
        // if there is, we delete / invalidate it
        // generate a new one.
        const foundLink = await linkRepository
          .createQueryBuilder('link')
          .where('link.user = :userId', { userId })
          .getOne();

        if (foundLink) {
          linkRepository.delete(foundLink.id);
        }

        const specialURL = jwt.sign({ id: foundUser.id }, PRIVKEY, { algorithm: 'RS256', expiresIn: '5m' });

        const activationLink = new Link();
        activationLink.user = foundUser;
        activationLink.token = specialURL;

        const newLink = await linkRepository.save(activationLink);

        if (newLink) {
          res.status(200).json({
            message: 'Login with URL',
            action: 'checkin',
            url: `http://fallen.lol:${process.env.PORT}/api/login/${Buffer.from(newLink.id).toString('base64')}`,
          });
        }
      } else {
        res.status(404).json({ message: 'Resource Not Found', action: 'checkin', user: [] });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', action: 'checkin', user: [] });
      console.log('[ApiController::checkin] ERROR', error, User, userRepository, AppDataSource);
    }
  };

  static register = async (req: Request, res: Response) => {
    const { headers } = req;
    const ownerKey = headers['x-secondlife-toucher-key'] as string;
    const ownerName = headers['x-secondlife-toucher-name'] as string;

    try {
      if (!ownerName || !ownerKey) {
        res.status(400).json({ message: 'Missing data.', action: 'register', user: [] });
        return;
      }

      const foundUser = await userRepository.findOneBy({ uuid: ownerKey });

      if (foundUser) {
        res.status(409).json({ action: 'register', message: 'User already exists' });
      } else {
        const { firstName, lastName, uuid, planType } = req.body;
        const [splitFirst, splitLast] = ownerName.split(/[\.|\s]/);

        console.log('[Name Parts]| First: %s\nLast: %s', splitFirst, splitLast);

        if (!firstName || !lastName || !uuid || !planType) {
          res
            .status(400)
            .json({ message: 'Missing data.', action: 'register', debug: [firstName, lastName, uuid, planType], req });
          return;
        }

        const user = new User();

        user.firstName = firstName;
        user.lastName = lastName;
        user.uuid = uuid;
        user.generateJWT();

        const newUser = await userRepository.save(user);
        const specialURL = jwt.sign({ id: newUser.id }, PRIVKEY, { algorithm: 'RS256', expiresIn: '5m' });

        if (newUser) {
          const activationLink = new Link();
          activationLink.user = newUser;
          activationLink.token = specialURL;
          // activationLink.generateTokenURL();

          const newLink = await linkRepository.save(activationLink);

          res.status(201).json({
            message: 'User created',
            action: 'register',
            user: newUser,
            url: `http://fallen.lol:8013/api/login/${Buffer.from(newLink.id).toString('base64')}`,
          });
        }
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', action: 'register', user: [], req: req.body });
    }
  };

  static login = async (req: Request, res: Response) => {
    const { token } = req.params;

    const cleanLink = Buffer.from(token, 'base64').toString();
    const foundLink = await linkRepository.findOneById(cleanLink);

    if (!foundLink) {
      res.status(404).json({ message: 'Invalid activation link' });
      return;
    }

    const verified = jwt.verify(foundLink.token, PUBKEY, { algorithms: ['RS256'] });

    if (verified) {
      const user = verified as { id: string };
      const foundUser = await userRepository.findOneById(user.id);
      const apiToken = jwt.sign({ id: foundUser.id }, PRIVKEY, { algorithm: 'RS256', expiresIn: '5d' });
      if (foundUser) {
        foundUser.apiToken = apiToken;
        await userRepository.save(foundUser);
        await linkRepository.delete(foundLink.id);
        res.status(200).json({ message: 'OK', action: 'login', user: foundUser });
      } else {
        res.status(400).json({ message: 'Invalid user or link', action: 'login' });
      }

      return;
    } else {
      res.status(400).json({ message: 'Invalid Token', action: 'login', user: [] });
      return;
    }
  };

  static verify = async (req: Request, res: Response) => {
    const {
      headers: { authorization },
    } = req;
    const token = authorization.replace(/bearer\s+/gi, '');

    try {
      const verified = jwt.verify(token, PUBKEY, { algorithms: ['RS256'] });
      res.status(200).json({ message: verified });
    } catch (err) {
      const error = err as Error;
      console.warn('VERIFY ERROR', error);
      res.status(500).json({ message: 'Internal Server Error', action: 'verify', req: req.body });
    }
  };
}

export default ApiService;
