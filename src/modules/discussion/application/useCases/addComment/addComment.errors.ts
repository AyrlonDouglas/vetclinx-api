import BaseError from '@common/errors/baseError.error';
import { HttpStatusCode } from '@common/http/httpStatusCode';

class DiscussionNotFoundError extends BaseError {
  constructor(discussion: string) {
    super([`The discussion ${discussion} not found`], HttpStatusCode.NOT_FOUND);
    this.name = 'AddCommentDiscussionNotFoundError';
  }
}

const AddCommentErrors = {
  DiscussionNotFoundError,
};

export default AddCommentErrors;
