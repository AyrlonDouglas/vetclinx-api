import { Vote } from '@modules/discussion/domain/entities/vote/vote.entity';
import { VoteForType } from '@modules/discussion/domain/component/voteManager.component';

export abstract class VoteRepository {
  abstract save(vote: Vote, voteFor: VoteForType): Promise<string>;
  abstract findOneByFilter(filter: findOneByFilterInput): Promise<Vote>;
  abstract deleteById(id: string, voteFor: VoteForType): Promise<number>;
  abstract deleteByVoteForReferency(
    voteForReferencyList: string[],
    voteFor: VoteForType,
  ): Promise<number>;
}

export type findOneByFilterInput = {
  user?: string;
  voteFor: VoteForType;
  voteForReferency?: string;
};
