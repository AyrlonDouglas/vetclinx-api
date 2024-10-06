import { Either } from '@common/core/either';
import { InspetorError } from '@common/core/inspetor';
import { RemoveDiscussionErrors } from './removeDiscussion.errors';

export type RemoveDiscussionInput = { discussionId: string };

export type RemoveDiscussionOutput = Either<
  | InspetorError
  | InstanceType<(typeof RemoveDiscussionErrors)['DiscussionNotFoundError']>
  | InstanceType<(typeof RemoveDiscussionErrors)['OnlyCreatorCanDeleteError']>,
  { deleted: boolean; commentDeletedCount: number; voteDeletedCount: number }
>;
