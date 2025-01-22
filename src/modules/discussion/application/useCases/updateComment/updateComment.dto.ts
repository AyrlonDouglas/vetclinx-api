import { Either } from '@common/core/either';
import { InspetorError } from '@common/core/inspetor';

export class UpdateCommentInput {
  commentId: string;
  content: string;
}

export type UpdateCommentOutput = Either<InspetorError, { id: string }>;
