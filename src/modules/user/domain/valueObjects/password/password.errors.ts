import BaseError from '@common/errors/baseError.error';
import { HttpStatusCode } from '@common/http/httpStatusCode';

class InvalidPasswordError extends BaseError {
  constructor() {
    super([`Password is invalid!`], HttpStatusCode.NOT_ACCEPTABLE);
    this.name = 'InvalidPasswordError';
  }
}

const PasswordErrors = {
  InvalidPasswordError,
};
export default PasswordErrors;
