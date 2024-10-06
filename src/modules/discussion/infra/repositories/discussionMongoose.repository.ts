import { DiscussionRepository } from '@modules/discussion/application/repositories/discussion.repository';
import { Discussion } from '@modules/discussion/domain/entities/discussion/discussion.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DiscussionModel } from '../schemas/discussion.schema';
import { DiscussionMapper } from '../mapper/discussion.mapper';
import { CommentMapper } from '../mapper/comment.mapper';
import { Injectable } from '@nestjs/common';
import { ContextStorageService } from '@modules/shared/domain/contextStorage.service';
@Injectable()
export class DiscussionMongooseRepository implements DiscussionRepository {
  discussionMapper = new DiscussionMapper();
  commentMapper = new CommentMapper();

  constructor(
    @InjectModel(DiscussionModel.name)
    private readonly discussionModel: Model<DiscussionModel>,
    private readonly context: ContextStorageService,
  ) {}

  async deleteById(id: string): Promise<number> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) return 0;

    const session = this.context.get('session');

    const discussionRemoved = await this.discussionModel.deleteOne(
      { _id: id },
      { session },
    );

    return discussionRemoved.deletedCount;
  }

  async save(discussion: Discussion): Promise<string> {
    if (discussion.props.id) {
      return this.updateDiscussionById(discussion.props.id, discussion);
    } else {
      return this.create(discussion);
    }
  }

  async create(discussion: Discussion): Promise<string> {
    const session = this.context.get('session');

    const [discussionCreated] = await this.discussionModel.create(
      [this.discussionMapper.toPersistense(discussion)],
      { session },
    );

    return discussionCreated.id;
  }

  async updateDiscussionById(
    id: string,
    discussion: Discussion,
  ): Promise<string | null> {
    const session = this.context.get('session');

    const updated = await this.discussionModel.findByIdAndUpdate(
      id,
      this.discussionMapper.toPersistense(discussion),
      { session },
    );

    return updated.id;
  }

  async findById(id: string): Promise<Discussion | null> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) return null;

    const discussion = await this.discussionModel.findById(
      new Types.ObjectId(id),
    );
    if (!discussion) return null;

    return this.discussionMapper.toDomain(discussion);
  }
}
