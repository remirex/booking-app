import { Inject, Service } from 'typedi';
import { Body, Post, Response, Route, SuccessResponse, Tags, Query, Hidden, Security, Request } from 'tsoa';
import qrcode from 'qrcode';
import speakeasy from 'speakeasy';

import config from '../../config';
import Generic from '../generic';
import { IUser, IUser2FACodeDTO, IUserDataStoredInTokenDTO } from '../../interfaces/IUser';
import { generateJwtToken } from '../../helpers/jwt/token';
import { generateRefreshToken } from '../../helpers/auth/auth';
import { LoggedUserResponse } from '../../types/loggedUserResponse';
import Wrong2FACode from '../../api/exceptions/auth/wrong2FACode';

@Route('/auth')
@Tags('Two-Factor Authentication (2FA)')
@Service()
export default class TwoFactorAuth extends Generic {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('refreshTokenModel') private refreshTokenModel: Models.RefreshTokenModel,
  ) {
    super(userModel);
  }

  /**
   * Applications like the Google Authenticator allow users to add a page that they authenticate to either by manually entering a `key`, or scanning a `QR` code.
   * QR code in writable stream in response object.
   * @param userId
   * @param response
   */
  @Security('jwt')
  @Post('/2fa/generate')
  public async generateTwoFactorAuthenticationCode(@Request() userId: string, @Request() response: any) {
    const secretCode = speakeasy.generateSecret({ name: config.twoFactorAppName });
    const toUpdate = { twoFactorAuthenticationCode: secretCode.base32 };
    await this.update(userId, toUpdate, false, false);
    return qrcode.toFileStream(response, secretCode.otpauth_url!);
  }

  /**
   * We check if the provided `code` is valid. If that's the case, we enable the Two-Factor Authentication.
   * @param data
   * @param user
   */
  @Security('jwt')
  @Post('/2fa/turn-on')
  public async turnOnTwoFactorAuthentication(@Body() data: IUser2FACodeDTO, @Request() user: IUser): Promise<boolean> {
    const isCodeValid = await verifyTwoAuthCode(data.code, user);
    if (isCodeValid) {
      const toUpdate = { isTwoFactorAuthenticationEnabled: true };
      await this.update(user.id, toUpdate, false, false);
      return true;
    }
    return false;
  }

  /**
   * 1. The user attempts to log in using his `email` and a valid `password`, and we give him a JWT token.
   *    - if he doesn't have the `2FA` turned on, this gives him full access.
   *    - if he does have the `2FA` turned on, we provide him with access just to the /2fa/authenticate endpoint.
   * 2. The user sends a valid code to the /2fa/authenticate endpoint and is given a new JWT token with full access.
   * @param data
   * @param user
   * @param ipAddress
   */
  @Security('jwt')
  @Post('/2fa/authenticate')
  public async secondFactorAuthentication(
    @Body() data: IUser2FACodeDTO,
    @Request() user: IUser,
    @Query() @Hidden() ipAddress?: string,
  ): Promise<LoggedUserResponse> {
    const isCodeValid = await verifyTwoAuthCode(data.code, user);
    if (!isCodeValid) throw new Wrong2FACode();
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
      isTwoFactorAuthenticationEnabled: user.isTwoFactorAuthenticationEnabled,
      jwtToken,
      refreshToken: refreshToken.token,
    };
  }
}

async function verifyTwoAuthCode(code: string, user: IUser) {
  return speakeasy.totp.verify({
    secret: user.twoFactorAuthenticationCode,
    encoding: 'base32',
    token: code,
  });
}
