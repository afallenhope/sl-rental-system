import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config();
export const dataSourceOptions: DataSourceOptions = {
  // @ts-ignore
  type: process.env.DB_DRIVER,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [resolve(__dirname, '../**/entities/*.entity.{ts,js}')],
  migrations: [resolve(__dirname, '../database/**/migrations/*.ts')],
  synchronize: false,
  logging: false,
};

export const AppDataSource: DataSource = new DataSource(dataSourceOptions);
