import BaseError from '@common/errors/baseError.error';
import { HttpStatusCode } from '@common/http/httpStatusCode';

class CreatorCannotVoteYourDiscussion extends BaseError {
  constructor() {
    super([`Creator cannot vote your discussion`], HttpStatusCode.NOT_FOUND);
    this.name = 'VoteOnDiscussionCreatorCannotVoteYourDiscussionError';
  }
}

export const VoteOnDiscussionError = {
  CreatorCannotVoteYourDiscussion,
};
