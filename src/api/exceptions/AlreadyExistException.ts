import HttpException from './httpException';

class AlreadyExistException extends HttpException {
  constructor(name: string) {
    super(400, `Record: [${name}] already exists into database.`);
  }
}

export default AlreadyExistException;
