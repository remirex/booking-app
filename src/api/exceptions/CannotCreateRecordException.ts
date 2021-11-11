import HttpException from '@/api/exceptions/httpException';

class CannotCreateRecordException extends HttpException {
  constructor() {
    super(400, 'Record cannot be created.');
  }
}

export default CannotCreateRecordException;
