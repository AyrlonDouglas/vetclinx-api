import BaseError from '@common/errors/baseError.error';
import { HttpStatusCode } from '@common/http/httpStatusCode';

class DiscussionNotFoundError extends BaseError {
  constructor(discussionId: string) {
    super(
      [`The discussion ${discussionId} not found`],
      HttpStatusCode.NOT_FOUND,
    );
    this.name = 'AddCommentDiscussionNotFoundError';
  }
}

const AddCommentErrors = {
  DiscussionNotFoundError,
};

export default AddCommentErrors;
