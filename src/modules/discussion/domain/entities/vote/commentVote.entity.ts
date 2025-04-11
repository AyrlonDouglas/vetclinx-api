import { Either, left, right } from '@common/core/either';
import { VoteTypes } from '../../component/voteManager.component';
import Inspector, { InspectorError } from '@common/core/inspector';

export class CommentVote {
  private constructor(
    private readonly authorId: string,
    private voteType: keyof typeof VoteTypes,
    private readonly commentId: string,
    private readonly createdAt: Date = new Date(),
    private readonly updatedAt: Date = new Date(),
    private readonly id?: string,
  ) {}

  get props(): CommentVoteProps {
    return {
      authorId: this.authorId,
      createdAt: this.createdAt,
      commentId: this.commentId,
      updatedAt: this.updatedAt,
      voteType: this.voteType,
      id: this.id,
    };
  }

  static create(
    input: CommentVoteCreateInput,
  ): Either<InspectorError, CommentVote> {
    const inputOrFail = Inspector.againstFalsyBulk([
      { argument: input.authorId, argumentName: 'authorId' },
      { argument: input.voteType, argumentName: 'voteType' },
      { argument: input.commentId, argumentName: 'commentId' },
    ]);

    if (inputOrFail.isLeft()) {
      return left(inputOrFail.value);
    }

    const isOneOfVoteTypesOrFail = Inspector.isOneOf(
      input.voteType,
      Object.values(VoteTypes),
      'voteType',
    );

    if (isOneOfVoteTypesOrFail.isLeft()) {
      return left(isOneOfVoteTypesOrFail.value);
    }

    const commentVote = new CommentVote(
      input.authorId,
      input.voteType,
      input.commentId,
      input.createdAt,
      input.updatedAt,
      input.id,
    );

    return right(commentVote);
  }

  setVoteType(voteType: keyof typeof VoteTypes) {
    const isOneOfVoteTypesOrCancel = Inspector.isOneOf(
      voteType,
      [VoteTypes.down, VoteTypes.up],
      'voteType',
    );

    if (isOneOfVoteTypesOrCancel.isLeft()) {
      return;
    }

    this.voteType = voteType;
  }
}

type CommentVoteProps = {
  id?: string;
  authorId: string;
  voteType: keyof typeof VoteTypes;
  commentId: string;
  createdAt: Date;
  updatedAt: Date;
};

type CommentVoteCreateInput = Partial<CommentVoteProps> &
  Pick<CommentVoteProps, 'authorId' | 'commentId' | 'voteType'>;
