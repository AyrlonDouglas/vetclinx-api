import BaseError from '@common/errors/baseError.error';
import { HttpStatusCode } from '@common/http/httpStatusCode';
import { DiscussionVote as DiscussionVotePostgre } from '@modules/database/infra/postgreSQL/entities/discussionVote.db.entity';
import {
  DiscussionVoteRepository,
  findOneByFilterInput,
} from '@modules/discussion/application/repositories/discussionVote.repository';
import { DiscussionVote } from '@modules/discussion/domain/entities/vote/discussionVote.entity';
import { TransactionService } from '@modules/shared/domain/transaction.service';
import { Injectable } from '@nestjs/common';
import { EntityManager, FindOneOptions } from 'typeorm';

@Injectable()
export class DiscussionVotePostgreRepository
  implements DiscussionVoteRepository
{
  constructor(private readonly transactionService: TransactionService) {}

  async save(discussionVote: DiscussionVote): Promise<string> {
    const repository = this.getRepository();
    const discussionVoteToSave = this.toEntityPostgre(discussionVote);
    await repository.save(discussionVoteToSave);
    return discussionVoteToSave.id.toString();
  }

  async findOneByFilter(filter: findOneByFilterInput): Promise<DiscussionVote> {
    const repository = this.getRepository();
    const findOneOptions: FindOneOptions<DiscussionVotePostgre> = {
      where: {
        ...(filter.discussionId ? { discussionId: +filter.discussionId } : {}),
        ...(filter.authorId ? { authorId: +filter.authorId } : {}),
      },
    };

    const discussionVotePostgre = await repository.findOne(findOneOptions);

    return discussionVotePostgre ? this.toDomain(discussionVotePostgre) : null;
  }

  async deleteById(id: string): Promise<number> {
    const repository = this.getRepository();
    const deleteResult = await repository.delete({ id: +id });
    return deleteResult.affected;
  }

  async deleteByDiscussionId(discussionId: string[] | string): Promise<number> {
    const repository = this.getRepository();
    const deleteResult = await repository.delete({
      discussionId: +discussionId,
    });

    return deleteResult.affected;
  }

  toEntityPostgre(discussionVote: DiscussionVote): DiscussionVotePostgre {
    const discussionVotePostgre = new DiscussionVotePostgre();
    discussionVotePostgre.authorId = +discussionVote.props.authorId;
    discussionVotePostgre.discussionId = +discussionVote.props.discussionId;
    discussionVotePostgre.voteType = discussionVote.props.voteType;

    if (discussionVote.props.id) {
      discussionVotePostgre.id = +discussionVote.props.id;
    }

    return discussionVotePostgre;
  }

  getRepository() {
    const entityManager =
      this.transactionService.getEntityManager() as EntityManager;

    return entityManager.withRepository(
      entityManager.getRepository(DiscussionVotePostgre),
    );
  }

  toDomain(discussionVotePostgre: DiscussionVotePostgre): DiscussionVote {
    const discussionVote = DiscussionVote.create({
      authorId: discussionVotePostgre.authorId.toString(),
      discussionId: discussionVotePostgre.discussionId.toString(),
      voteType: discussionVotePostgre.voteType,
      createdAt: discussionVotePostgre.createdAt,
      updatedAt: discussionVotePostgre.updatedAt,
      id: discussionVotePostgre.id.toString(),
    });

    if (discussionVote.isLeft()) {
      throw new BaseError(
        ['Some error to map discussionVote'],
        HttpStatusCode.CONFLICT,
      );
    }

    return discussionVote.value;
  }
}
