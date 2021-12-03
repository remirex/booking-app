import HttpException from '../httpException';

class Wrong2FACode extends HttpException {
  constructor() {
    super(401, 'Wrong 2FA code provided');
  }
}

export default Wrong2FACode;