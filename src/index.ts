import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/data-source';
import apiRouter from './routes/api';

dotenv.config(); // this allows the use of .env files

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    const PORT = process.env.PORT || 3000; // custom port or default to 3000

    app.use(cors()); // allow external connections
    app.use(express.json()); // this means default is application/json
    app.use(express.urlencoded({ extended: true }));

    app.use('/api', apiRouter);

    // bring in our routes.
    app.get('/', (req: Request, res: Response) => {
      res.status(418).send("I'm a teapot");
    });

    app.listen(PORT, () => {
      console.log(`⚡[${process.env.APP_NAME} Server] Running on port ${PORT}...`);
    });
  })
  .catch((error) => console.warn(`[x] Server error! ${error.message}`));
