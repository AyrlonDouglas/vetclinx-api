import BaseError from '@common/errors/baseError.error';
import { HttpStatusCode } from '@common/http/httpStatusCode';

class DiscussionNotFoundError extends BaseError {
  constructor(discussionId: string) {
    super(
      [`The discussion ${discussionId} not found`],
      HttpStatusCode.NOT_FOUND,
    );
    this.name = 'UpdateDiscussionDiscussionNotFoundError';
  }
}

class OnlyCreatorCanDeleteError extends BaseError {
  constructor() {
    super(
      [`Only the creator of the discussion can delete it.`],
      HttpStatusCode.CONFLICT,
    );
    this.name = 'UpdateDiscussionOnlyCreatorCanDeleteError';
  }
}
class OnlyCreatorCanUpdateError extends BaseError {
  constructor() {
    super(
      [`Only the creator of the discussion can update it.`],
      HttpStatusCode.CONFLICT,
    );
    this.name = 'UpdateDiscussionOnlyCreatorCanDeleteError';
  }
}

const UpdateDiscussionErrors = {
  DiscussionNotFoundError,
  OnlyCreatorCanDeleteError,
  OnlyCreatorCanUpdateError,
};

export default UpdateDiscussionErrors;
