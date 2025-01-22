import BaseError from '@common/errors/baseError.error';
import { HttpStatusCode } from '@common/http/httpStatusCode';

class CommentNotFoundError extends BaseError {
  constructor(discussion: string) {
    super([`The comment ${discussion} not found`], HttpStatusCode.NOT_FOUND);
    this.name = 'VoteOnCommentCommentNotFoundError';
  }
}

class CreatorCannotVoteYourComment extends BaseError {
  constructor() {
    super([`Creator cannot vote your comment`], HttpStatusCode.NOT_FOUND);
    this.name = 'VoteOnCommentCreatorCannotVoteYourCommentError';
  }
}

export const VoteOnCommentError = {
  CommentNotFoundError,
  CreatorCannotVoteYourComment,
};
