import { Either } from '@common/core/either';
import { InspectorError } from '@common/core/inspector';
import { VoteTypes } from '@modules/discussion/domain/component/voteManager.component';
import { VoteOnDiscussionError } from './voteOnDiscussion.errors';
import DiscussionErrors from '../discussion.errors';

export type VoteTheDiscussionInput = {
  discussionId: string;
  voteType: keyof typeof VoteTypes;
};

export type VoteTheDiscussionOutput = Either<
  | InspectorError
  | InstanceType<
      (typeof VoteOnDiscussionError)['CreatorCannotVoteYourDiscussion']
    >
  | InstanceType<(typeof DiscussionErrors)['DiscussionNotFoundError']>,
  { id: string }
>;
