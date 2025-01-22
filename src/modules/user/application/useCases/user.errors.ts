import BaseError from '@common/errors/baseError.error';
import { HttpStatusCode } from '@common/http/httpStatusCode';

class UserNotFoundError extends BaseError {
  constructor() {
    super([`User not found`], HttpStatusCode.NOT_FOUND);
    this.name = 'UserNotFoundError';
  }
}

const UserErrors = {
  UserNotFoundError,
};

export default UserErrors;
