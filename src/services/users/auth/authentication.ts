import { Inject, Service } from 'typedi';
import { Body, Post, Response, Route, SuccessResponse, Tags, Query, Hidden } from 'tsoa';

import Generic from '../../generic';
import {
  ITokenInputDTO,
  IUserInputDTO,
  IUserLoginDTO,
  IUserEmailDTO,
  IUserPasswordResetDTO,
  IUserDataStoredInTokenDTO,
} from '../../../interfaces/IUser';
import { UserRole, UserStatus } from '../../../helpers/enums/enums';
import { EmailTemplates } from '../../../helpers/enums/enums';
import UserWithThatEmailAlreadyRegisterButNotVerifiedException from '../../../api/exceptions/auth/userWithThatEmailAlreadyRegisterButNotVerifiedException';
import { generateRefreshToken, randomTokenString } from '../../../helpers/auth/auth';
import { ValidationErrorResponse } from '../../../types/validationErrorResponse';
import Notifications from '../../email/notifications';
import UserWithThatEmailAlreadyExistsException from '../../../api/exceptions/auth/userWithThatEmailAlreadyExistsException';
import WrongCredentialException from '../../../api/exceptions/auth/wrongCredentialException';
import NotVerifiedException from '../../../api/exceptions/auth/notVerifiedException';
import { generateJwtToken } from '../../../helpers/jwt/token';
import { LoggedUserResponse } from '../../../types/loggedUserResponse';
import NotFoundException from '../../../api/exceptions/notFoundException';

@Route('/auth')
@Tags('Authentication (Email sign up and verification & Forgot password and reset password functionality)')
@Service()
export default class Authentication extends Generic {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('refreshTokenModel') private refreshTokenModel: Models.RefreshTokenModel,
    @Inject('password') private password,
    private notification: Notifications,
  ) {
    super(userModel);
  }

  @Post('/register')
  @SuccessResponse('201', 'Created')
  @Response<ValidationErrorResponse>(422, 'Validation Failed', {
    name: 'Validation Error.',
    message: 'Some fields are not valid.',
    status: false,
    errors: [
      {
        message: 'name is not allowed to be empty',
        field: {
          label: 'name',
          value: '',
          key: 'name',
        },
      },
    ],
  })
  public async register(@Body() registerData: IUserInputDTO): Promise<boolean> {
    const user = await this.findBy('email', registerData.email, []);
    if (user && user.status === UserStatus.INACTIVE) {
      const data = { 'verificationToken.expires': new Date(Date.now() + 24 * 60 * 60 * 1000) };
      await this.update(user.id, data, true, false, [], []);

      await this.notification.sendTemplateEmail(
        registerData.email,
        'Booking API - Verify Email',
        EmailTemplates.VERIFY_EMAIL,
        {
          name: user.name,
          token: user.verificationToken.token,
        },
      );

      throw new UserWithThatEmailAlreadyRegisterButNotVerifiedException();
    }

    if (user && user.status === UserStatus.ACTIVE) {
      await this.notification.sendTemplateEmail(
        registerData.email,
        'Booking API - Email Already Registered',
        EmailTemplates.ALREADY_REGISTERED,
        user,
      );

      throw new UserWithThatEmailAlreadyExistsException(registerData.email);
    }

    const isFirstAccount = (await this.countDocuments()) === 0;

    const verifyToken = randomTokenString();
    const expireToken = new Date(Date.now() + 24 * 60 * 60 * 1000); // create verify token that expires after 24 hours

    if (isFirstAccount) {
      registerData['role'] = UserRole.ADMIN;
      registerData['status'] = UserStatus.ACTIVE;
      registerData['verified'] = Date.now();
    } else {
      registerData['verificationToken'] = { token: verifyToken, expires: expireToken };
    }

    await this.create(registerData, false, true, ['email', 'username'], [registerData.email, registerData.username]);

    await this.notification.sendTemplateEmail(
      registerData.email,
      'Booking API - Verify Email',
      EmailTemplates.VERIFY_EMAIL,
      {
        name: registerData.name,
        token: verifyToken,
      },
    );

    return true;
  }

  @Post('/verify-email')
  @SuccessResponse('200', 'Verified')
  @Response<ValidationErrorResponse>(422, 'Validation Failed', {
    name: 'Validation Error.',
    message: 'Some fields are not valid.',
    status: false,
    errors: [
      {
        message: 'token is not allowed to be empty',
        field: {
          label: 'token',
          value: '',
          key: 'token',
        },
      },
    ],
  })
  public async verifyAccount(@Body() tokenData: ITokenInputDTO): Promise<boolean> {
    const queryObject = {
      'verificationToken.token': tokenData.token,
      'verificationToken.expires': { $gt: Date.now() },
    };
    const user = await this.findByQueryObject(queryObject);

    const updateData = {
      verified: Date.now(),
      status: UserStatus.ACTIVE,
      verificationToken: {},
    };

    await this.update(user.id, updateData, false, false);

    return true;
  }

  @Post('/login')
  @SuccessResponse('200', 'LoggedIn')
  @Response<ValidationErrorResponse>(422, 'Validation Failed', {
    name: 'Validation Error.',
    message: 'Some fields are not valid.',
    status: false,
    errors: [
      {
        message: 'email is not allowed to be empty',
        field: {
          label: 'email',
          value: '',
          key: 'email',
        },
      },
    ],
  })
  public async login(
    @Body() loginData: IUserLoginDTO,
    @Query() @Hidden() ipAddress?: string,
  ): Promise<LoggedUserResponse> {
    const user = await this.findBy('email', loginData.email, []);

    if (!user) throw new WrongCredentialException();
    if (user && user.status != UserStatus.ACTIVE) throw new NotVerifiedException();

    const validPassword = await this.password.compare(user.password, loginData.password);
    if (!validPassword) throw new WrongCredentialException();

    const dataStoredInToken: IUserDataStoredInTokenDTO = {
      id: user.id,
      role: user.role,
      status: user.status,
      isTwoFactorAuthenticated: false,
    };
    const jwtToken = generateJwtToken(dataStoredInToken);
    const refreshToken = await generateRefreshToken(user, ipAddress!, this.refreshTokenModel);

    return {
      auth: true,
      jwtToken,
      refreshToken: refreshToken.token,
      isTwoFactorAuthenticationEnabled: !!user.isTwoFactorAuthenticationEnabled,
    };
  }

  @Post('/forgot-password')
  @SuccessResponse('200', 'Email was sent')
  @Response<ValidationErrorResponse>(422, 'Validation Failed', {
    name: 'Validation Error.',
    message: 'Some fields are not valid.',
    status: false,
    errors: [
      {
        message: 'email is not allowed to be empty',
        field: {
          label: 'email',
          value: '',
          key: 'email',
        },
      },
    ],
  })
  public async forgotPassword(@Body() data: IUserEmailDTO): Promise<boolean> {
    const user = await this.findBy('email', data.email, []);
    if (!user) throw new NotFoundException();

    user.resetToken = {
      token: randomTokenString(),
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };
    user.save();

    await this.notification.sendTemplateEmail(
      data.email,
      'Booking API - Reset Password',
      EmailTemplates.RESET_PASSWORD,
      {
        username: user.username,
        token: user.resetToken.token,
      },
    );
    return true;
  }
  @Post('/reset-password')
  @SuccessResponse('200', 'Password was successfully reset')
  @Response<ValidationErrorResponse>(422, 'Validation Failed', {
    name: 'Validation Error.',
    message: 'Some fields are not valid.',
    status: false,
    errors: [
      {
        message: 'password is not allowed to be empty',
        field: {
          label: 'password',
          value: '',
          key: 'password',
        },
      },
    ],
  })
  public async resetPassword(@Body() resetData: IUserPasswordResetDTO): Promise<boolean> {
    const queryObject = {
      'resetToken.token': resetData.token,
      'resetToken.expires': { $gt: Date.now() },
    };
    await this.findByQueryObject(queryObject);

    const hash = await this.password.toHash(resetData.password);

    await this.updateOne(
      { 'resetToken.token': resetData.token },
      { password: hash, passwordReset: Date.now(), resetToken: {} },
    );
    return true;
  }
}
