import { Inject, Service } from 'typedi';
import { Body, Post, Response, Route, SuccessResponse, Tags, Query, Hidden } from 'tsoa';

import Generic from '../generic';
import {
  ITokenInputDTO,
  IUserInputDTO,
  IUserLoginDTO,
  IUserEmailDTO,
  IUserPasswordResetDTO,
  IUserDataStoredInTokenDTO,
} from '../../interfaces/IUser';
import { UserRole, UserStatus } from '../../helpers/enums/enums';
import { EmailTemplates } from '../../helpers/enums/enums';
import UserWithThatEmailAlreadyRegisterButNotVerifiedException from '../../api/exceptions/auth/userWithThatEmailAlreadyRegisterButNotVerifiedException';
import { generateRefreshToken, randomTokenString } from '../../helpers/auth/auth';
import { ValidationErrorResponse } from '../../types/validationErrorResponse';
import Notifications from '../email/notifications';
import UserWithThatEmailAlreadyExistsException from '../../api/exceptions/auth/userWithThatEmailAlreadyExistsException';
import WrongCredentialException from '../../api/exceptions/auth/wrongCredentialException';
import NotVerifiedException from '../../api/exceptions/auth/notVerifiedException';
import { generateJwtToken } from '../../helpers/jwt/token';
import { LoggedUserResponse } from '../../types/loggedUserResponse';
import NotFoundException from '../../api/exceptions/notFoundException';

// @Route('/auth')
// @Tags('Authorization')
// @Service()
// export default class User extends Generic {
//   constructor(
//     @Inject('userModel') private userModel: Models.UserModel,
//     @Inject('refreshTokenModel') private refreshTokenModel: Models.RefreshTokenModel,
//     @Inject('password') private password,
//     private notification: Notifications,
//   ) {
//     super(userModel);
//   }
//
//
// }
