import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source';
import { VerifyErrors } from 'jsonwebtoken';
import { User } from '@app/entities/user.entity';
const userRepository = AppDataSource.getRepository(User);

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const { headers } = req;

  if (headers?.authorization) {
    jwt.verify(headers.authorization, process.env.JWT_SECRET, async (error: VerifyErrors, decoded) => {
      if (error) {
        Object.assign(req, { user: undefined })
      }
      try {
        const parsed = decoded as User;
        const user = await userRepository.findOneById(parsed?.id);
        Object.assign(req, { user });
        next();
      } catch (ex) {
        res.status(500).json({message: 'Internal Server Error'}); 
      }
    });
  }
};
