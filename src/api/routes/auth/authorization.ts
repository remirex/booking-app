import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';

import User from '../../../services/user';
import { IUserInputDTO, ITokenInputDTO, IUserLoginDTO } from '../../../interfaces/IUser';
import bodyRequest from '../../requests';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  const authServiceInstance = Container.get(User);
  const logger: Logger = Container.get('logger');

  route.post('/register', bodyRequest.registerSchema, async (req: Request, res: Response, next: NextFunction) => {
    logger.debug('Calling Register endpoint with body: %o', req.body);
    try {
      const response = await authServiceInstance.register(req.body as IUserInputDTO);
      return res.status(201).json(response);
    } catch (err) {
      logger.error('🔥 error: %o', err);
      return next(err);
    }
  });

  route.post('/verify-email', bodyRequest.verifySchema, async (req: Request, res: Response, next: NextFunction) => {
    logger.debug('Calling Verify Email endpoint with body: %o', req.body);
    try {
      const response = await authServiceInstance.verifyAccount(req.body as ITokenInputDTO);
      return res.status(200).json(response);
    } catch (err) {
      logger.error('🔥 error: %o', err);
      return next(err);
    }
  });

  route.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    logger.debug('Calling User Login endpoint with body: %o', req.body);
    try {
      const response = await authServiceInstance.login(req.body as IUserLoginDTO, req.ip);
      return res.status(200).json(response);
    } catch (err) {
      logger.error('🔥 error: %o', err);
      return next(err);
    }
  });
};
