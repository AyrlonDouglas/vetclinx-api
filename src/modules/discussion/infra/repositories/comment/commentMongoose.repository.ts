import {
  CommentRepository,
  findByFilterInput,
} from '@modules/discussion/application/repositories/comment.repository';
import { Comment } from '@modules/discussion/domain/entities/comment/comment.entity';
import { InjectModel } from '@nestjs/mongoose';
import { CommentModel } from '../../schemas/comment.schema';
import { FilterQuery, Model, Types } from 'mongoose';
import { CommentMapper } from '../../mapper/comment.mapper';
import { Injectable } from '@nestjs/common';
import { ContextStorageService } from '@modules/shared/domain/contextStorage.service';

@Injectable()
export class CommentMongooseRepository implements CommentRepository {
  commentMapper = new CommentMapper();

  constructor(
    @InjectModel(CommentModel.name)
    private readonly commentModel: Model<CommentModel>,
    private readonly context: ContextStorageService,
  ) {}

  async findByFilter(filter: findByFilterInput): Promise<Comment[]> {
    const { discussionId } = filter;
    const filterQuery: FilterQuery<CommentModel> = {
      discussion: discussionId ? new Types.ObjectId(discussionId) : undefined,
    };

    const comments = await this.commentModel.find(filterQuery);

    return comments.map((comment) => this.commentMapper.toDomain(comment));
  }

  async deleteByDiscussionId(discussionId: string): Promise<number> {
    const isValidId = Types.ObjectId.isValid(discussionId);
    if (!isValidId) return 0;

    const session = this.context.get('session');
    const commentsRemoveds = await this.commentModel.deleteMany(
      {
        discussion: new Types.ObjectId(discussionId),
      },
      { session },
    );

    return commentsRemoveds.deletedCount;
  }

  async deleteByParentCommentId(parentCommentId: string): Promise<number> {
    const isValidId = Types.ObjectId.isValid(parentCommentId);
    if (!isValidId) return 0;

    const session = this.context.get('session');
    const commentsRemoveds = await this.commentModel.deleteMany(
      {
        parentCommentId: new Types.ObjectId(parentCommentId),
      },
      { session },
    );

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

    const session = this.context.get('session');
    const commentRemoved = await this.commentModel.deleteOne(
      { _id: id },
      { session },
    );
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
    const session = this.context.get('session');

    if (comment.props.id) {
      const commentUpdated = await this.commentModel.findByIdAndUpdate(
        comment.props.id,
        this.commentMapper.toPersistense(comment),
        { session },
      );
      return commentUpdated.id;
    } else {
      const [commentCreated] = await this.commentModel.create(
        [this.commentMapper.toPersistense(comment)],
        { session },
      );
      return commentCreated.id;
    }
  }
}
