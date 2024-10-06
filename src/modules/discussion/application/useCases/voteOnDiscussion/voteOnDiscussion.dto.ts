import { Either } from '@common/core/either';
import { InspetorError } from '@common/core/inspetor';
import { VoteTypes } from '@modules/discussion/domain/component/voteManager.component';
import { VoteTheDiscussionError } from './voteOnDiscussion.errors';

export type VoteTheDiscussionInput = {
  discussionId: string;
  vote: keyof typeof VoteTypes;
};

export type VoteTheDiscussionOutput = Either<
  | InspetorError
  | InstanceType<
      (typeof VoteTheDiscussionError)['CreatorCannotVoteYourDiscussion']
    >
  | InstanceType<(typeof VoteTheDiscussionError)['DiscussionNotFoundError']>,
  { id: string }
>;
