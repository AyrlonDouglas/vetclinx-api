import BaseError from '@shared/errors/baseError.error';
import { HttpStatusCode } from '@shared/http/httpStatusCode';

class UsernameTakenError extends BaseError {
  constructor(username: string) {
    super(
      [`The username ${username} was already taken`],
      HttpStatusCode.CONFLICT,
    );
    this.name = 'UsernameTakenError';
  }
}

class EmailAlreadyExistsError extends BaseError {
  constructor(email: string) {
    super(
      [`The email ${email} associated for this account already exists`],
      HttpStatusCode.CONFLICT,
    );
    this.name = 'EmailAlreadyExistsError';
  }
}

export default {
  usernameTakenError: UsernameTakenError,
  emailAlreadyExistsError: EmailAlreadyExistsError,
};