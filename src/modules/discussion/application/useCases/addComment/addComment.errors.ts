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
    this.name = 'AddCommentParentCommentNotFoundError';
  }
}

class ParentCommetMustBeRootError extends BaseError {
  constructor() {
    super([`The parent commet must be root`], HttpStatusCode.BAD_REQUEST);
    this.name = 'AddCommentParentCommentNotFoundError';
  }
}

class ParentCommentDoesNotBelongToTheDiscussionError extends BaseError {
  constructor() {
    super(
      ['Parente comment does not belong to the discussion'],
      HttpStatusCode.BAD_REQUEST,
    );
    this.name = 'AddCommentParentCommentDoesNotBelongToTheDiscussionError';
  }
}

const AddCommentErrors = {
  DiscussionNotFoundError,
  ParentCommentNotFoundError,
  ParentCommetMustBeRootError,
  ParentCommentDoesNotBelongToTheDiscussionError,
};

export default AddCommentErrors;
