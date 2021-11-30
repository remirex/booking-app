import HttpException from '../httpException';

class WrongCredentialException extends HttpException {
  constructor() {
    super(401, 'Wrong credentials provided');
  }
}

export default WrongCredentialException;
