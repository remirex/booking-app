import HttpException from '../httpException';

class UserWithThatUsernameAlreadyExistsException extends HttpException {
  constructor(username: string) {
    super(400, `User with username: [${username}] already exists`);
  }
}

export default UserWithThatUsernameAlreadyExistsException;
