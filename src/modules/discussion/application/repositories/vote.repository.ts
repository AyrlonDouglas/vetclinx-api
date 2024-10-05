import { Vote } from '@modules/discussion/domain/entities/vote/vote.entity';
import { VoteFor } from '@modules/discussion/domain/component/voteManager.component';

export abstract class VoteRepository {
  abstract save(vote: Vote): Promise<string>;
  abstract findOneByFilter(filter: {
    user?: string;
    voteFor?: keyof typeof VoteFor;
    voteForReferency?: string;
  }): Promise<Vote>;
  abstract deleteById(id: string): Promise<number>;
}
