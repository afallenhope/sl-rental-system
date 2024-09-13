import ApiController from '../controllers/ApiController';
import { SLValidator } from '../middlewares/slvalidator.middleware';
import { Request, Response } from 'express';
import Router from 'express-promise-router';

const apiRouter = Router();

apiRouter.get('/', SLValidator, (req: Request, res: Response) => {
  res.status(418).json({ message: 'I\'m a teapot' });
});


apiRouter.get('/checkin', SLValidator, ApiController.checkin);
apiRouter.get('/login/:token', ApiController.login);
apiRouter.post('/register', SLValidator, ApiController.register);
apiRouter.get('/verify', ApiController.verify);
export default apiRouter;
