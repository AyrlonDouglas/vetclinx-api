import BaseError from '@common/errors/baseError.error';
import { HttpStatusCode } from '@common/http/httpStatusCode';

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
