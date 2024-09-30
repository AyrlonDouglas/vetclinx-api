import BaseError from '@common/errors/baseError.error';
import { HttpStatusCode } from '@common/http/httpStatusCode';

class DiscussionNotFoundError extends BaseError {
  constructor(discussion: string) {
    super([`The discussion ${discussion} not found`], HttpStatusCode.NOT_FOUND);
    this.name = 'AddCommentDiscussionNotFoundError';
  }
}

class ParentCommentNotFoundError extends BaseError {
  constructor(commentId: string) {
    super(
      [`The parent comment ${commentId} not found`],
      HttpStatusCode.NOT_FOUND,
    );
    this.name = 'AddCommentCommentNotFoundError';
  }
}

const AddCommentErrors = {
  DiscussionNotFoundError,
  ParentCommentNotFoundError,
};

export default AddCommentErrors;
