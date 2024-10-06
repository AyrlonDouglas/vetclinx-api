import BaseError from '@common/errors/baseError.error';
import { HttpStatusCode } from '@common/http/httpStatusCode';

class DiscussionNotFoundError extends BaseError {
  constructor(discussion: string) {
    super([`The discussion ${discussion} not found`], HttpStatusCode.NOT_FOUND);
    this.name = 'VoteOnDiscussionDiscussionNotFoundError';
  }
}

class CreatorCannotVoteYourDiscussion extends BaseError {
  constructor() {
    super([`Creator cannot vote your discussion`], HttpStatusCode.NOT_FOUND);
    this.name = 'VoteOnDiscussionCreatorCannotVoteYourDiscussionError';
  }
}

export const VoteOnDiscussionError = {
  DiscussionNotFoundError,
  CreatorCannotVoteYourDiscussion,
};
