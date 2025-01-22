import BaseError from '@common/errors/baseError.error';
import { HttpStatusCode } from '@common/http/httpStatusCode';

class DiscussionNotFoundError extends BaseError {
  constructor(discussion: string) {
    super([`The discussion ${discussion} not found`], HttpStatusCode.NOT_FOUND);
    this.name = 'UpdateDiscussionDiscussionNotFoundError';
  }
}

class OnlyCreatorCanUpdateError extends BaseError {
  constructor() {
    super(
      [`Only the creator of the discussion can update it.`],
      HttpStatusCode.CONFLICT,
    );
    this.name = 'UpdateDiscussionOnlyCreatorCanUpdateError';
  }
}

const UpdateDiscussionErrors = {
  DiscussionNotFoundError,
  OnlyCreatorCanUpdateError,
};

export default UpdateDiscussionErrors;
