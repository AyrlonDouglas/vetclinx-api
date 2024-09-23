import { DiscussionRepository } from '@modules/discussion/application/repositories/discussion.repository';
import { Discussion } from '@modules/discussion/domain/entities/discussion/discussion.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DiscussionModel } from '../schemas/discussion.schema';
import { DiscussionMapper } from '../mapper/discussion.mapper';
import { CommentModel } from '../schemas/comment.schema';
import { CommentMapper } from '../mapper/comment.mapper';
import { TransactionService } from '@modules/shared/domain/transaction.service';
export class DiscussionMongooseRepository implements DiscussionRepository {
  discussionMapper = new DiscussionMapper();
  commentMapper = new CommentMapper();

  constructor(
    @InjectModel(DiscussionModel.name)
    private readonly discussionModel: Model<DiscussionModel>,

    @InjectModel(CommentModel.name)
    private readonly commentModel: Model<CommentModel>,

    private readonly transactionService: TransactionService,
  ) {}

  async save(discussion: Discussion): Promise<string> {
    if (discussion.props.id) {
      return this.updateDiscussionById(discussion.props.id, discussion);
    } else {
      return this.create(discussion);
    }
  }

  async create(discussion: Discussion): Promise<string> {
    const discussionCreated = await this.discussionModel.create(
      this.discussionMapper.toPersistense(discussion),
    );

    return discussionCreated.id;
  }

  async updateDiscussionById(
    id: string,
    discussion: Discussion,
  ): Promise<string | null> {
    const updated = await this.discussionModel.findByIdAndUpdate(
      id,
      this.discussionMapper.toPersistense(discussion),
    );

    return updated.id;
  }

  async findById(id: string): Promise<Discussion | null> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) return null;

    const discussion = await this.discussionModel.findById(id);
    if (!discussion) return null;

    return this.discussionMapper.toDomain(discussion);
  }
}
