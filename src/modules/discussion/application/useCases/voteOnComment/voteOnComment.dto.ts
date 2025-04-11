import { Either } from '@common/core/either';
import { InspectorError } from '@common/core/inspector';
import { VoteTypes } from '@modules/discussion/domain/component/voteManager.component';

export type VoteOnCommentInput = {
  commentId: string;
  voteType: keyof typeof VoteTypes;
};
export type VoteOnCommentOutput = Either<InspectorError, { id: string }>;
