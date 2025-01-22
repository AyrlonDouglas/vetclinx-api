import BaseError from '@common/errors/baseError.error';
import { HttpStatusCode } from '@common/http/httpStatusCode';

class DiscussionNotFoundError extends BaseError {
  constructor(discussion: string) {
    super([`The discussion ${discussion} not found`], HttpStatusCode.NOT_FOUND);
    this.name = 'RemoveDiscussionDiscussionNotFoundError';
  }
}

class OnlyCreatorCanDeleteError extends BaseError {
  constructor() {
    super(
      [`Only the creator of the discussion can delete it.`],
      HttpStatusCode.CONFLICT,
    );
    this.name = 'RemoveDiscussionOnlyCreatorCanDeleteError';
  }
}

export const RemoveDiscussionErrors = {
  OnlyCreatorCanDeleteError,
  DiscussionNotFoundError,
};
