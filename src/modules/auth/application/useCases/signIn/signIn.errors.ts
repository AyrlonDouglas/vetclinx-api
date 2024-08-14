import BaseError from '@shared/errors/baseError.error';
import { HttpStatusCode } from '@shared/http/httpStatusCode';

class UnauthorizedError extends BaseError {
  constructor() {
    super([`Unauthorized`], HttpStatusCode.UNAUTHORIZED);
    this.name = 'UnauthorizedError';
  }
}

const SignInError = { UnauthorizedError };

export default SignInError;
