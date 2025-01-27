import BaseError from '@common/errors/baseError.error';
import { HttpStatusCode } from '@common/http/httpStatusCode';

class DiscussionNotFoundError extends BaseError {
  constructor() {
    super([`Discussion not found`], HttpStatusCode.NOT_FOUND);
    this.name = 'DiscussionNotFoundError';
  }
}
const DiscussionErrors = { DiscussionNotFoundError };
export default DiscussionErrors;
