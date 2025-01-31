import {
  CommentRepository,
  findByFilterInput,
} from '@modules/discussion/application/repositories/comment.repository';
import { Comment } from '@modules/discussion/domain/entities/comment/comment.entity';
import { TransactionService } from '@modules/shared/domain/transaction.service';
import { EntityManager, In } from 'typeorm';
import { Comment as CommentPostgre } from '@modules/database/infra/postgreSQL/entities/comment.db.entity';
import BaseError from '@common/errors/baseError.error';
import { HttpStatusCode } from '@common/http/httpStatusCode';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentPostgreRepository implements CommentRepository {
  constructor(private readonly transactionService: TransactionService) {}

  async save(comment: Comment): Promise<string> {
    const repo = this.getRepository();
    const commentToSave = this.toEntityPostgre(comment);
    await repo.save(commentToSave);

    return commentToSave.id.toString();
  }

  async findById(id: string): Promise<Comment | null> {
    const repo = this.getRepository();
    const commentFound = await repo.findOneBy({ id: +id });

    return commentFound ? this.toDomain(commentFound) : null;
  }

  async deleteById(id: string | string[]): Promise<number> {
    const repo = this.getRepository();
    const commentIds = [...(Array.isArray(id) ? id : [id])];

    const deleteResultParents = await repo.delete({
      parentCommentId: In(commentIds),
    });

    const deleteResult = await repo.delete({
      id: In(commentIds),
    });

    return deleteResult.affected + deleteResultParents.affected;
  }

  async deleteByDiscussionId(discussionId: string): Promise<number> {
    const repository = this.getRepository();
    const deleteResult = await repository.delete({
      discussionId: +discussionId,
    });
    return deleteResult.affected;
  }

  async deleteByParentCommentId(parentCommentId: string): Promise<number> {
    const repository = this.getRepository();
    const deleteResult = await repository.delete({
      parentCommentId: +parentCommentId,
    });

    return deleteResult.affected;
  }

  async findChildrenCommentsByCommentId(id: string): Promise<Comment[] | null> {
    const repo = this.getRepository();
    const comments = await repo.find({ where: { parentCommentId: +id } });
    return comments.length
      ? comments.map((comment) => this.toDomain(comment))
      : null;
  }

  async findByFilter(filter: findByFilterInput): Promise<Comment[]> {
    const comments = await this.getRepository().find({
      where: {
        discussionId: +filter.discussionId,
      },
    });

    return comments.map((comment) => {
      return this.toDomain(comment);
    });
  }

  toDomain(commentPostgre: CommentPostgre): Comment {
    const commentDomain = Comment.create({
      authorId: commentPostgre.authorId.toString(),
      content: commentPostgre.content,
      discussionId: commentPostgre.discussionId.toString(),
      commentCount: commentPostgre.commentCount,
      id: commentPostgre.id.toString(),
      downvotes: commentPostgre.downvotes,
      parentCommentId: commentPostgre.parentCommentId?.toString(),
      upvotes: commentPostgre.upvotes,
      createdAt: commentPostgre.createdAt,
      updatedAt: commentPostgre.updatedAt,
    });

    if (commentDomain.isLeft()) {
      throw new BaseError(
        ['Erro on map comment to domain'],
        HttpStatusCode.CONFLICT,
      );
    }

    return commentDomain.value;
  }

  toEntityPostgre(comment: Comment): CommentPostgre {
    const commentPostgre = new CommentPostgre();
    commentPostgre.authorId = +comment.props.authorId;
    commentPostgre.commentCount = comment.props.commentCount;
    commentPostgre.content = comment.props.content;
    commentPostgre.discussionId = +comment.props.discussionId;
    commentPostgre.upvotes = comment.props.upvotes;
    commentPostgre.downvotes = comment.props.downvotes;

    if (comment.props.parentCommentId) {
      commentPostgre.parentCommentId = +comment.props.parentCommentId;
    }
    if (comment.props.id) {
      commentPostgre.id = +comment.props.id;
    }

    return commentPostgre;
  }

  getRepository() {
    const entityManager =
      this.transactionService.getEntityManager() as EntityManager;

    return entityManager.withRepository(
      entityManager.getTreeRepository(CommentPostgre),
    );
  }
}
