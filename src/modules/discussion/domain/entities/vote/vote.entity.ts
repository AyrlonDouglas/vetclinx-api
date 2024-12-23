import { Either, left, right } from '@common/core/either';
import Inspetor, { InspetorError } from '@common/core/inspetor';
import {
  VoteFor,
  VoteTypes,
} from '@modules/discussion/domain/component/voteManager.component';

export class Vote {
  private constructor(
    private readonly user: string,
    private voteType: keyof typeof VoteTypes,
    private readonly voteFor: keyof typeof VoteFor,
    private readonly voteForReferency: string,
    private readonly createdAt: Date = new Date(),
    private readonly updatedAt: Date = new Date(),
    private readonly id?: string,
  ) {}

  get props(): VoteProps {
    return {
      user: this.user,
      voteFor: this.voteFor,
      voteType: this.voteType,
      voteForReferency: this.voteForReferency,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      id: this.id,
    };
  }

  setVoteType(voteType: keyof typeof VoteTypes) {
    const isOneOfVoteTypesOrCancel = Inspetor.isOneOf(
      voteType,
      [VoteTypes.down, VoteTypes.up],
      'voteType',
    );

    if (isOneOfVoteTypesOrCancel.isLeft()) {
      return;
    }

    this.voteType = voteType;
  }

  static create(input: VoteCreateInput): Either<InspetorError, Vote> {
    const validate = this.validateCreateInput(input);

    if (validate.isLeft()) {
      return left(validate.value);
    }

    const vote = new Vote(
      input.user,
      input.voteType,
      input.voteFor,
      input.voteForReferency,
      input.createdAt,
      input.updatedAt,
      input.id,
    );
    return right(vote);
  }

  static validateCreateInput(
    input: VoteCreateInput,
  ): Either<InspetorError, boolean> {
    const inputOrFail = Inspetor.againstFalsyBulk([
      { argument: input.user, argumentName: 'user' },
      { argument: input.voteType, argumentName: 'voteType' },
      { argument: input.voteFor, argumentName: 'voteFor' },
      { argument: input.voteForReferency, argumentName: 'voteForReferency' },
    ]);

    if (inputOrFail.isLeft()) {
      return left(inputOrFail.value);
    }

    const isOneOfVoteTypesOrFail = Inspetor.isOneOf(
      input.voteType,
      Object.values(VoteTypes),
      'voteType',
    );

    if (isOneOfVoteTypesOrFail.isLeft()) {
      return left(isOneOfVoteTypesOrFail.value);
    }

    const isOneOfVoteForOrFail = Inspetor.isOneOf(
      input.voteFor,
      Object.values(VoteFor),
      'voteFor',
    );

    if (isOneOfVoteForOrFail.isLeft()) {
      return left(isOneOfVoteForOrFail.value);
    }

    return right(true);
  }
}

type VoteProps = {
  id?: string;
  user: string;
  voteType: keyof typeof VoteTypes;
  voteFor: keyof typeof VoteFor;
  voteForReferency: string;
  createdAt: Date;
  updatedAt: Date;
};

type VoteCreateInput = Partial<VoteProps> &
  Pick<VoteProps, 'user' | 'voteFor' | 'voteForReferency' | 'voteType'>;
