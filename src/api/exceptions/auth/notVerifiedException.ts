import HttpException from '../httpException';

class NotVerifiedException extends HttpException {
  constructor() {
    super(400, 'Account not verified yet');
  }
}

export default NotVerifiedException;
