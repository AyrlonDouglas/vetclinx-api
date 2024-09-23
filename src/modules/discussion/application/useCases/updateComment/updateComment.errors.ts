import BaseError from '@common/errors/baseError.error';
import { HttpStatusCode } from '@common/http/httpStatusCode';

class CommentNotFoundError extends BaseError {
  constructor(commentId: string) {
    super([`The comment ${commentId} not found`], HttpStatusCode.NOT_FOUND);
    this.name = 'UpdateCommentCommentNotFoundError';
  }
}

class OnlyCreatorCanUpdateError extends BaseError {
  constructor() {
    super(
      [`Only the creator of the comment can update it.`],
      HttpStatusCode.CONFLICT,
    );
    this.name = 'UpdateCommentOnlyCreatorCanDeleteError';
  }
}

export const UpdateCommentErrors = {
  CommentNotFoundError,
  OnlyCreatorCanUpdateError,
};
