import { AppDataSource } from '../config/data-source';
import { Request, Response } from 'express';
import { BaseEntity } from 'typeorm';
import { User } from '../entities/user.entity';
import jwt from 'jsonwebtoken';
import { Link } from '../entities/link.entity';

import ApiService from '../services/ApiService';

const userRepository = AppDataSource.getRepository(User);

class ApiController extends BaseEntity {
  static checkin = async (req: Request, res: Response) => {
    return ApiService.checkin(req, res);
  };

  static register = async (req: Request, res: Response) => {
    return ApiService.register(req, res);
  };

  static login = async (req: Request, res: Response) => {
    return ApiService.login(req, res); 
  };

  static verify = async (req: Request, res: Response) => {
    return ApiService.verify(req, res);
  }
}

export default ApiController;
