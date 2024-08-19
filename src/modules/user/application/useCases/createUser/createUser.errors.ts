import BaseError from '@common/errors/baseError.error';
import { HttpStatusCode } from '@common/http/httpStatusCode';

class UsernameTakenError extends BaseError {
  constructor(username: string) {
    super(
      [`The username ${username} was already taken`],
      HttpStatusCode.CONFLICT,
    );
    this.name = 'CreatUserUsernameTakenError';
  }
}

class EmailAlreadyExistsError extends BaseError {
  constructor(email: string) {
    super(
      [`The email ${email} associated for this account already exists`],
      HttpStatusCode.CONFLICT,
    );
    this.name = 'CreatUserEmailAlreadyExistsError';
  }
}

const CreatUserErrors = {
  UsernameTakenError,
  EmailAlreadyExistsError,
};

export default CreatUserErrors;
