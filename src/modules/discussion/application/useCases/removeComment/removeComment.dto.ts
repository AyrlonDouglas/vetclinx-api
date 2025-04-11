import { Either } from '@common/core/either';
import { InspectorError } from '@common/core/inspector';
import { RemoveCommentErrors } from './removeComment.errors';

export class RemoveCommentInput {
  commentId: string;
}
export type RemoveCommentOutput = Either<
  | InspectorError
  | InstanceType<(typeof RemoveCommentErrors)['CommentNotFoundError']>
  | InstanceType<(typeof RemoveCommentErrors)['OnlyCreatorCanRemoveError']>,
  { deleted: boolean; count: number }
>;
