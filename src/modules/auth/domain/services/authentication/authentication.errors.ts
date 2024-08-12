import BaseError from '@shared/errors/baseError.error';
import { HttpStatusCode } from '@shared/http/httpStatusCode';

class InvalidCredentialError extends BaseError {
  constructor() {
    super([`Invalid credential`], HttpStatusCode.NOT_FOUND);
    this.name = 'InvalidCredentialError';
  }
}

export default { invalidCredentialError: InvalidCredentialError };
