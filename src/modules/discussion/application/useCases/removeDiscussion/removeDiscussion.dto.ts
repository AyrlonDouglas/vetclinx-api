import { Either } from '@common/core/either';
import { InspectorError } from '@common/core/inspector';
import { RemoveDiscussionErrors } from './removeDiscussion.errors';
import DiscussionErrors from '../discussion.errors';

export type RemoveDiscussionInput = { discussionId: string };

export type RemoveDiscussionOutput = Either<
  | InspectorError
  | InstanceType<(typeof DiscussionErrors)['DiscussionNotFoundError']>
  | InstanceType<(typeof RemoveDiscussionErrors)['OnlyCreatorCanDeleteError']>,
  {
    deleted: boolean;
    commentDeletedCount: number;
    discussionVotesDeleteds: number;
    commentVotesDeleteds: number;
  }
>;
