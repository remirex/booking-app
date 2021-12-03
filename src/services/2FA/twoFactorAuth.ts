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
  @Security('jwt')
  @Post('/2fa/generate')
  public async generateTwoFactorAuthenticationCode(@Request() userId: string, @Request() response: any) {
    const secretCode = speakeasy.generateSecret({ name: config.twoFactorAppName });
    const toUpdate = { twoFactorAuthenticationCode: secretCode.base32 };
    await this.update(userId, toUpdate, false, false);
    return qrcode.toFileStream(response, secretCode.otpauth_url!);
  }

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
