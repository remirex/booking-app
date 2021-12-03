import HttpException from '../httpException';

class WrongAuthenticationTokenException extends HttpException {
  constructor(msg?: string) {
    super(401, msg ? msg : 'Wrong authentication token');
  }
}

export default WrongAuthenticationTokenException;
