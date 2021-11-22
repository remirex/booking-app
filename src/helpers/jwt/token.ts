import jwt from 'jsonwebtoken';

import config from '../../config';

export function generateJwtToken(dataStoredInToken: any) {
  return jwt.sign(dataStoredInToken, config.jwtSecret, { expiresIn: '1h' });
}
