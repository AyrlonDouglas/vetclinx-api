import { Either, left, right } from '@common/core/either';
import { VoteTypes } from '../../component/voteManager.component';
import Inspector, { InspectorError } from '@common/core/inspector';

export class DiscussionVote {
  private constructor(
    private readonly authorId: string,
    private voteType: keyof typeof VoteTypes,
    private readonly discussionId: string,
    private readonly createdAt: Date = new Date(),
    private readonly updatedAt: Date = new Date(),
    private readonly id?: string,
  ) {}

  get props(): DiscussionVoteProps {
    return {
      authorId: this.authorId,
      createdAt: this.createdAt,
      discussionId: this.discussionId,
      updatedAt: this.updatedAt,
      voteType: this.voteType,
      id: this.id,
    };
  }

  static create(
    input: DiscussionVoteCreateInput,
  ): Either<InspectorError, DiscussionVote> {
    const inputOrFail = Inspector.againstFalsyBulk([
      { argument: input.authorId, argumentName: 'authorId' },
      { argument: input.voteType, argumentName: 'voteType' },
      { argument: input.discussionId, argumentName: 'discussionId' },
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

    const discussionVote = new DiscussionVote(
      input.authorId,
      input.voteType,
      input.discussionId,
      input.createdAt,
      input.updatedAt,
      input.id,
    );

    return right(discussionVote);
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

type DiscussionVoteProps = {
  id?: string;
  authorId: string;
  voteType: keyof typeof VoteTypes;
  discussionId: string;
  createdAt: Date;
  updatedAt: Date;
};

type DiscussionVoteCreateInput = Partial<DiscussionVoteProps> &
  Pick<DiscussionVoteProps, 'authorId' | 'discussionId' | 'voteType'>;
