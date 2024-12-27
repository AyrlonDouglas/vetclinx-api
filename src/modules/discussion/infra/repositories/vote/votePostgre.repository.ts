import { CommentVote } from '@modules/database/infra/posgreSQL/entities/commentVote.db.entity';
import { DiscussionVote } from '@modules/database/infra/posgreSQL/entities/discussionVote.db';
import {
  findOneByFilterInput,
  VoteRepository,
} from '@modules/discussion/application/repositories/vote.repository';
import {
  VoteFor,
  VoteForType,
} from '@modules/discussion/domain/component/voteManager.component';
import { Vote } from '@modules/discussion/domain/entities/vote/vote.entity';
import { TransactionService } from '@modules/shared/domain/transaction.service';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { BaseVoteHandler } from './handlers/baseVote.handler';
import { CommentVoteHandler } from './handlers/commentVoteHandler';
import { DiscussionVoteHandler } from './handlers/discussionVote.handler';

@Injectable()
export class VotePostgreRepository implements VoteRepository {
  private readonly handlers: Record<
    VoteForType,
    BaseVoteHandler<CommentVote | DiscussionVote>
  > = {
    [VoteFor.comment]: new CommentVoteHandler(),
    [VoteFor.discussion]: new DiscussionVoteHandler(),
  };

  constructor(private readonly transactionService: TransactionService) {}

  async save(vote: Vote, voteFor: VoteForType): Promise<string> {
    const handler = this.handlers[voteFor];
    const entityManager = this.getEntityManager();
    const entitySaved = await handler.save(vote, entityManager);
    return entitySaved.id.toString();
  }

  async findOneByFilter(filter: findOneByFilterInput): Promise<Vote> {
    const handler = this.handlers[filter.voteFor];
    const entityManager = this.getEntityManager();
    const entityFound = await handler.findOneByFilter(filter, entityManager);

    return entityFound ? handler.toDomain(entityFound) : null;
  }

  async deleteById(id: string, voteFor: VoteForType): Promise<number> {
    const handler = this.handlers[voteFor];
    const entityManager = this.getEntityManager();
    const deleteResult = await handler.deleteById(id, entityManager);
    return deleteResult.affected;
  }

  async deleteByVoteForReferency(
    voteForReferencyList: string[],
    voteFor: VoteForType,
  ): Promise<number> {
    const handler = this.handlers[voteFor];
    const entityManager = this.getEntityManager();
    const deleteResult = await handler.deleteByVoteForReferency(
      voteForReferencyList,
      entityManager,
    );
    return deleteResult.affected;
  }

  getEntityManager() {
    return this.transactionService.getEntityManager() as EntityManager;
  }
}
