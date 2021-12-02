import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { Logger } from 'winston';

import User from '../../../services/users/user';
import Auth from '../../middleware/auth';
import Token from '../../../services/authToken/token';
import {
  IUserInputDTO,
  ITokenInputDTO,
  IUserLoginDTO,
  IUserEmailDTO,
  IUserPasswordResetDTO,
} from '../../../interfaces/IUser';
import bodyRequest from '../../requests';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  const authServiceInstance = Container.get(User);
  const tokenServiceInstance = Container.get(Token);
  const authMiddlewareInstance = Container.get(Auth);
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
  route.post('/verify-email', bodyRequest.tokenSchema, async (req: Request, res: Response, next: NextFunction) => {
    logger.debug('Calling Verify Email endpoint with body: %o', req.body);
    try {
      const response = await authServiceInstance.verifyAccount(req.body as ITokenInputDTO);
      return res.status(200).json(response);
    } catch (err) {
      logger.error('🔥 error: %o', err);
      return next(err);
    }
  });
  route.post('/login', bodyRequest.loginSchema, async (req: Request, res: Response, next: NextFunction) => {
    logger.debug('Calling User Login endpoint with body: %o', req.body);
    try {
      const response = await authServiceInstance.login(req.body as IUserLoginDTO, req.ip);
      return res.status(200).json(response);
    } catch (err) {
      logger.error('🔥 error: %o', err);
      return next(err);
    }
  });
  route.post('/refresh-token', bodyRequest.tokenSchema, async (req: Request, res: Response, next: NextFunction) => {
    logger.debug('Calling Refresh Token endpoint with body: %o', req.body);
    try {
      const response = await tokenServiceInstance.refreshToken(req.body as ITokenInputDTO, req.ip);
      return res.status(200).json(response);
    } catch (err) {
      logger.error('🔥 error: %o', err);
      return next(err);
    }
  });
  route.post(
    '/revoke-token',
    authMiddlewareInstance.authMiddleware(),
    bodyRequest.tokenSchema,
    async (req: Request, res: Response, next: NextFunction) => {
      logger.debug('Calling Revoke Token endpoint with body: %o', req.body);
      try {
        let authHeader;
        if (
          (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
          (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
        ) {
          authHeader = req.headers.authorization.split(' ')[1];
        }
        const response = await tokenServiceInstance.revokeToken(req.body as ITokenInputDTO, req.ip, authHeader);
        return res.status(200).json(response);
      } catch (err) {
        logger.error('🔥 error: %o', err);
        return next(err);
      }
    },
  );
  route.post('/forgot-password', bodyRequest.forgotSchema, async (req: Request, res: Response, next: NextFunction) => {
    logger.debug('Calling Forgot Password endpoint with body: %o', req.body);
    try {
      const response = await authServiceInstance.forgotPassword(req.body as IUserEmailDTO);
      return res.status(200).json(response);
    } catch (err) {
      logger.error('🔥 error: %o', err);
      return next(err);
    }
  });
  route.post('/reset-password', bodyRequest.resetSchema, async (req: Request, res: Response, next: NextFunction) => {
    logger.debug('Calling Reset Password endpoint with body: %o', req.body);
    try {
      const response = await authServiceInstance.resetPassword(req.body as IUserPasswordResetDTO);
      return res.status(200).json(response);
    } catch (err) {
      logger.error('🔥 error: %o', err);
      return next(err);
    }
  });
};
