import BaseError from '@common/errors/baseError.error';
import { HttpStatusCode } from '@common/http/httpStatusCode';
import { CommentVote as CommentVotePostgre } from '@modules/database/infra/postgreSQL/entities/commentVote.db.entity';
import {
  CommentVoteRepository,
  findOneByFilterInput,
} from '@modules/discussion/application/repositories/commentVote.repository';
import { CommentVote } from '@modules/discussion/domain/entities/vote/commentVote.entity';
import { TransactionService } from '@modules/shared/domain/transaction.service';
import { Injectable } from '@nestjs/common';
import { EntityManager, FindOneOptions, In } from 'typeorm';

@Injectable()
export class CommentVotePostgreRepository implements CommentVoteRepository {
  constructor(private readonly transactionService: TransactionService) {}

  async save(commentVote: CommentVote): Promise<string> {
    const repository = this.getRepository();
    const commentVoteToSave = this.toEntityPostgre(commentVote);
    await repository.save(commentVoteToSave);
    return commentVoteToSave.id.toString();
  }

  async findOneByFilter(filter: findOneByFilterInput): Promise<CommentVote> {
    const repository = this.getRepository();
    const findOneOptions: FindOneOptions<CommentVotePostgre> = {
      where: {
        ...(filter.commentId ? { commentId: +filter.commentId } : {}),
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

  async deleteByCommentId(commentId: string | string[]): Promise<number> {
    const repository = this.getRepository();
    const commentIds = [
      ...(Array.isArray(commentId) ? commentId : [commentId]),
    ];
    const deleteResult = await repository.delete({
      commentId: In(commentIds),
    });
    return deleteResult.affected;
  }

  toEntityPostgre(commentVote: CommentVote): CommentVotePostgre {
    const commentVotePostgre = new CommentVotePostgre();
    commentVotePostgre.authorId = +commentVote.props.authorId;
    commentVotePostgre.commentId = +commentVote.props.commentId;
    commentVotePostgre.voteType = commentVote.props.voteType;

    if (commentVote.props.id) {
      commentVotePostgre.id = +commentVote.props.id;
    }

    return commentVotePostgre;
  }

  getRepository() {
    const entityManager =
      this.transactionService.getEntityManager() as EntityManager;

    return entityManager.withRepository(
      entityManager.getRepository(CommentVotePostgre),
    );
  }

  toDomain(commentVotePostgre: CommentVotePostgre): CommentVote {
    const commentVote = CommentVote.create({
      authorId: commentVotePostgre.authorId.toString(),
      commentId: commentVotePostgre.commentId.toString(),
      voteType: commentVotePostgre.voteType,
      createdAt: commentVotePostgre.createdAt,
      updatedAt: commentVotePostgre.updatedAt,
      id: commentVotePostgre.id.toString(),
    });

    if (commentVote.isLeft()) {
      throw new BaseError(
        ['Some error to map commentVote'],
        HttpStatusCode.CONFLICT,
      );
    }

    return commentVote.value;
  }
}
