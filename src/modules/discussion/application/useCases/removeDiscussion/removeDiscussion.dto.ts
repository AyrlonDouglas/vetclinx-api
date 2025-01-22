import { Either } from '@common/core/either';
import { InspetorError } from '@common/core/inspetor';
import { RemoveDiscussionErrors } from './removeDiscussion.errors';
import DiscussionErrors from '../discussion.errors';

export type RemoveDiscussionInput = { discussionId: string };

export type RemoveDiscussionOutput = Either<
  | InspetorError
  | InstanceType<(typeof DiscussionErrors)['DiscussionNotFoundError']>
  | InstanceType<(typeof RemoveDiscussionErrors)['OnlyCreatorCanDeleteError']>,
  {
    deleted: boolean;
    commentDeletedCount: number;
    discussionVotesDeleteds: number;
    commentVotesDeleteds: number;
  }
>;
