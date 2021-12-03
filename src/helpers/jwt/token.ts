import jwt from 'jsonwebtoken';

import config from '../../config';
import { IUserDataStoredInTokenDTO } from '../../interfaces/IUser';

export function generateJwtToken(dataStoredInToken: IUserDataStoredInTokenDTO) {
  return jwt.sign(dataStoredInToken, config.jwtSecret, { expiresIn: '1h' });
}
