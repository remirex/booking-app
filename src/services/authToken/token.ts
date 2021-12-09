import { Inject, Service } from 'typedi';
import { Body, Post, Response, Route, SuccessResponse, Tags, Query, Hidden, Security } from 'tsoa';

import Generic from '../generic';
import { ValidationErrorResponse } from '../../types/validationErrorResponse';
import { ITokenInputDTO, IUserDataStoredInTokenDTO } from '../../interfaces/IUser';
import NotFoundException from '../../api/exceptions/notFoundException';
import { generateRefreshToken, tokenOwner } from '../../helpers/auth/auth';
import { generateJwtToken } from '../../helpers/jwt/token';
import { LoggedUserResponse } from '../../types/loggedUserResponse';
import NotAllowedException from '../../api/exceptions/notAllowedException';

@Route('/auth')
@Tags('Refresh tokens (JWT authentication with refresh tokens)')
@Service()
export default class Token extends Generic {
  constructor(
    @Inject('refreshTokenModel') private refreshTokenModel: Models.RefreshTokenModel,
    @Inject('userModel') private userModel: Models.UserModel,
  ) {
    super(refreshTokenModel);
  }

  /**
   * Use a refresh token to generate a new JWT token and a new refresh token
   * @param refreshTokenData
   * @param ipAddress
   */
  @Post('/refresh-token')
  @SuccessResponse('200', 'Refreshed')
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
  public async refreshToken(
    @Body() refreshTokenData: ITokenInputDTO,
    @Query() @Hidden() ipAddress?: string,
  ): Promise<LoggedUserResponse> {
    const oldRefreshToken = await this.findBy('token', refreshTokenData.token, ['user']);
    console.log('isTwoFactorAuthenticated: ', oldRefreshToken.user.isTwoFactorAuthenticationEnabled);
    if (!oldRefreshToken || !oldRefreshToken.isActive) throw new NotFoundException();

    const newRefreshToken = await generateRefreshToken(oldRefreshToken.user, ipAddress!, this.refreshTokenModel);
    oldRefreshToken.revoked = Date.now();
    oldRefreshToken.revokedByIp = ipAddress!;
    oldRefreshToken.replacedByToken = newRefreshToken.token;

    await oldRefreshToken.save();

    const dataStoredInToken: IUserDataStoredInTokenDTO = {
      id: oldRefreshToken.user._id,
      role: oldRefreshToken.user.role,
      status: oldRefreshToken.user.status,
      isTwoFactorAuthenticated: oldRefreshToken.user.isTwoFactorAuthenticationEnabled,
    };

    const jwtToken = generateJwtToken(dataStoredInToken);

    return {
      auth: true,
      jwtToken,
      refreshToken: newRefreshToken.token,
      isTwoFactorAuthenticationEnabled: !!oldRefreshToken.user.isTwoFactorAuthenticationEnabled,
    };
  }

  /**
   * Revoke a refresh token.
   * Admin users can revoke the tokens of any account, regular users can only revoke their own tokens.
   * @param refreshTokenData
   * @param ipAddress
   * @param authHeader
   */
  @Security('jwt')
  @Post('/revoke-token')
  @SuccessResponse('200', 'Revoked')
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
  public async revokeToken(
    @Body() refreshTokenData: ITokenInputDTO,
    @Query() @Hidden() ipAddress?: string,
    @Query() @Hidden() authHeader?: string,
  ): Promise<boolean> {
    const findToken = await this.findBy('token', refreshTokenData.token, ['user']);
    const isOwner = await tokenOwner(findToken, authHeader, this.userModel, this.refreshTokenModel);
    if (!isOwner) throw new NotAllowedException();

    findToken.revoked = Date.now();
    findToken.revokedByIp = ipAddress;
    await findToken.save();
    return true;
  }
}
