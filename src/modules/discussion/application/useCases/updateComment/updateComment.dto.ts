import { Either } from '@common/core/either';
import { InspectorError } from '@common/core/inspector';

export class UpdateCommentInput {
  commentId: string;
  content: string;
}

export type UpdateCommentOutput = Either<InspectorError, { id: string }>;
