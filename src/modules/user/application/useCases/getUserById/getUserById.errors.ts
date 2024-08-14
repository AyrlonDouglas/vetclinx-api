import BaseError from '@common/errors/baseError.error';
import { HttpStatusCode } from '@common/http/httpStatusCode';

class UserNotFoundError extends BaseError {
  constructor(id: string) {
    super([`No user with the id ${id} was found`], HttpStatusCode.NOT_FOUND);
    this.name = 'UserNotFoundError';
  }
}

export default {
  userNotFoundError: UserNotFoundError,
};
