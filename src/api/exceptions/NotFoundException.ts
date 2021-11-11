import HttpException from '@/api/exceptions/httpException';

class NotFoundException extends HttpException {
  constructor() {
    super(404, 'Not Found.');
  }
}

export default NotFoundException;
