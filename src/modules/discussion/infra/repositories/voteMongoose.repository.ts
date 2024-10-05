import { VoteRepository } from '@modules/discussion/application/repositories/vote.repository';
import { VoteFor } from '@modules/discussion/domain/component/voteManager.component';
import { Vote } from '@modules/discussion/domain/entities/vote/vote.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VoteMongooseRepository implements VoteRepository {
  save(vote: Vote): Promise<string> {
    throw new Error('Method not implemented.');
  }
  findOneByFilter(filter: {
    user?: string;
    voteFor?: keyof typeof VoteFor;
    voteForReferency?: string;
  }): Promise<Vote> {
    throw new Error('Method not implemented.');
  }
  deleteById(id: string): Promise<number> {
    throw new Error('Method not implemented.');
  }
}
