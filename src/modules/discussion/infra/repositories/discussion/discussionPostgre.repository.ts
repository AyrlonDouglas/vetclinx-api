import { PaginationParams } from '@common/core/pagination';
import BaseError from '@common/errors/baseError.error';
import { HttpStatusCode } from '@common/http/httpStatusCode';
import { Discussion as DiscussionPostgre } from '@modules/database/infra/postgreSQL/entities/discussion.db.entity';
import { DiscussionRepository } from '@modules/discussion/application/repositories/discussion.repository';
import { Discussion } from '@modules/discussion/domain/entities/discussion/discussion.entity';
import { TransactionService } from '@modules/shared/domain/transaction.service';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class DiscussionPostgreRepository implements DiscussionRepository {
  constructor(private readonly transactionService: TransactionService) {}

  async findDiscussions(input: {
    paginationParams: PaginationParams;
  }): Promise<{ result: Discussion[]; count: number }> {
    const { paginationParams } = input;
    const repository = this.getRepository();
    const [discussions, count] = await repository.findAndCount({
      take: paginationParams.pageSize,
      skip: (paginationParams.page - 1) * paginationParams.pageSize,
    });
    return {
      result: discussions.map((discussion) => this.toDomain(discussion)),
      count,
    };
  }

  async save(discussion: Discussion): Promise<string> {
    const repository = this.getRepository();
    const discussionToSave = this.toEntityPostgre(discussion);
    await repository.save(discussionToSave);

    return discussionToSave.id.toString();
  }

  async create(discussion: Discussion): Promise<string> {
    return this.save(discussion);
  }

  async findById(id: string): Promise<Discussion | null> {
    const repository = this.getRepository();

    const discussion = await repository.findOneBy({
      id: +id,
    });
    if (!discussion) return null;
    return this.toDomain(discussion);
  }

  async updateDiscussionById(
    id: string,
    discussion: Discussion,
  ): Promise<string | null> {
    const repository = this.getRepository();

    const updateResult = await repository.update(
      { id: +id },
      this.toEntityPostgre(discussion),
    );

    return updateResult.affected ? id : null;
  }

  async deleteById(id: string): Promise<number> {
    const repository = this.getRepository();

    const deleteResult = await repository.delete({
      id: +id,
    });

    return deleteResult.affected;
  }

  toEntityPostgre(discussion: Discussion): DiscussionPostgre {
    const discussionPostgre = new DiscussionPostgre();
    discussionPostgre.authorId = +discussion.props.authorId;
    discussionPostgre.commentCount = discussion.props.commentCount;
    discussionPostgre.description = discussion.props.description;
    discussionPostgre.resolution = discussion.props.resolution;
    discussionPostgre.downvotes = discussion.props.downvotes;
    discussionPostgre.upvotes = discussion.props.upvotes;
    discussionPostgre.title = discussion.props.title;
    discussionPostgre.voteGrade = discussion.props.voteGrade;

    if (discussion.props.id) {
      discussionPostgre.id = +discussion.props.id;
    }

    return discussionPostgre;
  }

  getRepository() {
    const entityManager =
      this.transactionService.getEntityManager() as EntityManager;

    return entityManager.withRepository(
      entityManager.getRepository(DiscussionPostgre),
    );
  }

  toDomain(discussionPostgre: DiscussionPostgre): Discussion {
    const discussion = Discussion.create({
      authorId: discussionPostgre.authorId.toString(),
      description: discussionPostgre.description,
      title: discussionPostgre.title,
      commentCount: discussionPostgre.commentCount,
      createdAt: discussionPostgre.createdAt,
      downvotes: discussionPostgre.downvotes,
      id: discussionPostgre.id.toString(),
      resolution: discussionPostgre.resolution,
      updatedAt: discussionPostgre.updatedAt,
      upvotes: discussionPostgre.upvotes,
    });

    if (discussion.isLeft()) {
      throw new BaseError(
        ['Some error to map discussion'],
        HttpStatusCode.CONFLICT,
      );
    }

    return discussion.value;
  }
}
