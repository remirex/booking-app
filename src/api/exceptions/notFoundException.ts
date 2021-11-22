import HttpException from './httpException';

class NotFoundException extends HttpException {
  constructor() {
    super(404, 'Not Found.');
  }
}

export default NotFoundException;
