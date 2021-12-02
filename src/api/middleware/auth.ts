import { Inject, Service } from 'typedi';
import { NextFunction, RequestHandler, Response, Request } from 'express';
import jwt from 'jsonwebtoken';

import config from '../../config';
import { IUserDataStoredInTokenDTO } from '../../interfaces/IUser';
import Generic from '../../services/generic';
import AuthenticationTokenMissingException from '../exceptions/auth/authenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/auth/wrongAuthenticationTokenException';

@Service()
export default class Auth extends Generic {
  constructor(@Inject('userModel') private userModel: Models.UserModel) {
    super(userModel);
  }

  public authMiddleware(omitSecondFactor = false): RequestHandler {
    return async (request: Request, response: Response, next: NextFunction) => {
      if (
        (request.headers.authorization && request.headers.authorization.split(' ')[0] === 'Token') ||
        (request.headers.authorization && request.headers.authorization.split(' ')[0] === 'Bearer')
      ) {
        const token = request.headers.authorization.split(' ')[1];
        const secret = config.jwtSecret;
        const verificationResponse = jwt.verify(token, secret) as IUserDataStoredInTokenDTO;
        const { id, isTwoFactorAuthenticated } = verificationResponse;
        const user = await this.getById(id);
        if (user) {
          if (!omitSecondFactor && user.isTwoFactorAuthenticationEnabled && !isTwoFactorAuthenticated) {
            next(new WrongAuthenticationTokenException());
          } else {
            request.currentUser = user;
            next();
          }
        } else {
          next(new WrongAuthenticationTokenException());
        }
      } else {
        next(new AuthenticationTokenMissingException());
      }
    };
  }
}
