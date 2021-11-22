import * as crypto from 'crypto';

export function randomTokenString() {
  return crypto.randomBytes(40).toString('hex');
}
