import BaseError from '@common/errors/baseError.error';
import { HttpStatusCode } from '@common/http/httpStatusCode';

class UserNotFoundError extends BaseError {
  constructor(username: string) {
    super(
      [`No user with the username ${username} was found`],
      HttpStatusCode.NOT_FOUND,
    );
    this.name = 'GetUserByUsernameUserNotFoundError';
  }
}

export default {
  userNotFoundError: UserNotFoundError,
};
