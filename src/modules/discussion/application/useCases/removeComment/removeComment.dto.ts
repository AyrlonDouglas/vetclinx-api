import { Either } from '@common/core/either';
import { InspetorError } from '@common/core/inspetor';
import { RemoveCommentErrors } from './removeComment.errors';

export class RemoveCommentInput {
  commentId: string;
}
export type RemoveCommentOutput = Either<
  | InspetorError
  | InstanceType<(typeof RemoveCommentErrors)['CommentNotFoundError']>
  | InstanceType<(typeof RemoveCommentErrors)['OnlyCreatorCanRemoveError']>,
  { deleted: boolean; count: number }
>;
