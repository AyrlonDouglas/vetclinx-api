import BaseError from '@common/errors/baseError.error';
import { HttpStatusCode } from '@common/http/httpStatusCode';

class InvalidCredentialError extends BaseError {
  constructor() {
    super([`Invalid credential`], HttpStatusCode.NOT_FOUND);
    this.name = 'InvalidCredentialError';
  }
}
const AuthenticationErrors = {
  InvalidCredentialError,
};

export default AuthenticationErrors;
