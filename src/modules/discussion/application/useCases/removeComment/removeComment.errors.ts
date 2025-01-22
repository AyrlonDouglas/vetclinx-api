import BaseError from '@common/errors/baseError.error';
import { HttpStatusCode } from '@common/http/httpStatusCode';

class CommentNotFoundError extends BaseError {
  constructor(commentId: string) {
    super([`The comment ${commentId} not found`], HttpStatusCode.NOT_FOUND);
    this.name = 'RemoveCommentCommentNotFoundError';
  }
}

class OnlyCreatorCanRemoveError extends BaseError {
  constructor() {
    super(
      [`Only the creator of the discussion can remove it.`],
      HttpStatusCode.CONFLICT,
    );
    this.name = 'RemoveDiscussionOnlyCreatorCanRemoveError';
  }
}

export const RemoveCommentErrors = {
  CommentNotFoundError,
  OnlyCreatorCanRemoveError,
};
