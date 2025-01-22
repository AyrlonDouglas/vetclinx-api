import { Either } from '@common/core/either';
import { InspetorError } from '@common/core/inspetor';
import { VoteTypes } from '@modules/discussion/domain/component/voteManager.component';
import { VoteOnDiscussionError } from './voteOnDiscussion.errors';
import DiscussionErrors from '../discussion.errors';

export type VoteTheDiscussionInput = {
  discussionId: string;
  voteType: keyof typeof VoteTypes;
};

export type VoteTheDiscussionOutput = Either<
  | InspetorError
  | InstanceType<
      (typeof VoteOnDiscussionError)['CreatorCannotVoteYourDiscussion']
    >
  | InstanceType<(typeof DiscussionErrors)['DiscussionNotFoundError']>,
  { id: string }
>;
