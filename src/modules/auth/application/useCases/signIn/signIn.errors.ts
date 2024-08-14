import BaseError from '@common/errors/baseError.error';
import { HttpStatusCode } from '@common/http/httpStatusCode';

class UnauthorizedError extends BaseError {
  constructor() {
    super([`Unauthorized`], HttpStatusCode.UNAUTHORIZED);
    this.name = 'UnauthorizedError';
  }
}

const SignInError = { UnauthorizedError };

export default SignInError;
