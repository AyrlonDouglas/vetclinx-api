import BaseError from '@shared/errors/baseError.error';
import { HttpStatusCode } from '@shared/http/httpStatusCode';

class TokenServiceInvalidInputError extends BaseError {
  constructor(message: string) {
    super([`Invalid input. ${message}`], HttpStatusCode.NOT_FOUND);
    this.name = 'TokenServiceInvalidInputError';
  }
}

export default {
  invalidInputError: TokenServiceInvalidInputError,
};
