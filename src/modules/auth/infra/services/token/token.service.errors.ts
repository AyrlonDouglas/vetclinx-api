import BaseError from '@shared/errors/baseError.error';
import { HttpStatusCode } from '@shared/http/httpStatusCode';

class InvalidInputError extends BaseError {
  constructor(message: string) {
    super([`Invalid input. ${message}`], HttpStatusCode.NOT_FOUND);
    this.name = 'TokenServiceInvalidInputError';
  }
}

const TokenServiceErrors = {
  InvalidInputError,
};

export default TokenServiceErrors;
