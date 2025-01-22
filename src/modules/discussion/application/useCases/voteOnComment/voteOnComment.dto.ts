import { Either } from '@common/core/either';
import { InspetorError } from '@common/core/inspetor';
import { VoteTypes } from '@modules/discussion/domain/component/voteManager.component';

export type VoteOnCommentInput = {
  commentId: string;
  voteType: keyof typeof VoteTypes;
};
export type VoteOnCommentOutput = Either<InspetorError, { id: string }>;
