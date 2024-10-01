import { CommentRepository } from '@modules/discussion/application/repositories/comment.repository';
import { Comment } from '@modules/discussion/domain/entities/comment/comment.entity';
import { TransactionService } from '@modules/shared/domain/transaction.service';
import { InjectModel } from '@nestjs/mongoose';
import { CommentModel } from '../schemas/comment.schema';
import { Model, Types } from 'mongoose';
import { CommentMapper } from '../mapper/comment.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentMongooseRepository implements CommentRepository {
  commentMapper = new CommentMapper();

  constructor(
    @InjectModel(CommentModel.name)
    private readonly commentModel: Model<CommentModel>,
    private readonly transactionService: TransactionService,
  ) {}

  async deleteByDiscussionId(discussionId: string): Promise<number> {
    const isValidId = Types.ObjectId.isValid(discussionId);
    if (!isValidId) return 0;

    const commentsRemoveds = await this.commentModel.deleteMany({
      discussion: new Types.ObjectId(discussionId),
    });

    return commentsRemoveds.deletedCount;
  }

  async deleteByParentCommentId(parentCommentId: string): Promise<number> {
    const isValidId = Types.ObjectId.isValid(parentCommentId);
    if (!isValidId) return 0;

    const commentsRemoveds = await this.commentModel.deleteMany({
      parentCommentId: new Types.ObjectId(parentCommentId),
    });

    return commentsRemoveds.deletedCount;
  }

  async findChildrenCommentsByCommentId(id: string): Promise<Comment[] | null> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) return null;

    const childrenComments = await this.commentModel.find({
      parentCommentId: new Types.ObjectId(id),
    });

    return childrenComments.map((comment) =>
      this.commentMapper.toDomain(comment),
    );
  }

  async deleteById(id: string): Promise<number | null> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) return 0;

    const commentRemoved = await this.commentModel.deleteOne({ _id: id });
    return commentRemoved.deletedCount;
  }

  async findById(id: string): Promise<Comment | null> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) return null;

    const comment = await this.commentModel.findById(id);
    if (!comment) return null;

    return this.commentMapper.toDomain(comment);
  }

  async save(comment: Comment): Promise<string> {
    if (comment.props.id) {
      const commentUpdated = await this.commentModel.findByIdAndUpdate(
        comment.props.id,
        this.commentMapper.toPersistense(comment),
      );
      return commentUpdated.id;
    } else {
      const commentCreated = await this.commentModel.create(
        this.commentMapper.toPersistense(comment),
      );
      return commentCreated.id;
    }
  }
}
