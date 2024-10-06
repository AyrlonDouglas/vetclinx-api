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
    this.voteType = voteType;
  }

  static create(input: VoteCreateInput): Either<InspetorError, Vote> {
    const inputOrFail = Inspetor.againstFalsyBulk([
      { argument: input.user, argumentName: 'user' },
      { argument: input.voteType, argumentName: 'voteType' },
      { argument: input.voteFor, argumentName: 'voteFor' },
      { argument: input.voteForReferency, argumentName: 'voteForReferency' },
    ]);

    if (inputOrFail.isLeft()) {
      return left(inputOrFail.value);
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
