import {
  DiscussionMapper,
  DiscussionMapperToDomain,
} from '@modules/discussion/application/mappers/discussion.mapper';
import { DiscussionRepository } from '@modules/discussion/application/repositories/discussion.repository';
import { Discussion } from '@modules/discussion/domain/entities/discussion/discussion.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  DiscussionDocument,
  DiscussionModel,
} from '../schemas/discussion.schema';

export class DiscussionMongooseRepository implements DiscussionRepository {
  mapper: DiscussionMapper;

  constructor(
    @InjectModel(DiscussionModel.name)
    private readonly discussionModel: Model<DiscussionModel>,
  ) {
    this.mapper = new DiscussionMapper();
  }

  domainToModel(discussion: Discussion) {
    return {
      authorId: discussion.props.authorId,
      comments: discussion.props.comments,
      createdAt: discussion.props.createdAt,
      description: discussion.props.description,
      downvotes: discussion.props.downvotes,
      resolution: discussion.props.resolution,
      title: discussion.props.title,
      updatedAt: discussion.props.updatedAt,
      upvotes: discussion.props.upvotes,
    };
  }

  async create(discussion: Discussion): Promise<string> {
    const discussionCreated = await this.discussionModel.create(
      this.domainToModel(discussion),
    );
    return discussionCreated.id;
  }

  async updateById(id: string, discussion: Discussion): Promise<string | null> {
    const updated = await this.discussionModel.findByIdAndUpdate(
      id,
      this.domainToModel(discussion),
    );

    return updated.id;
  }

  modelToMapperDomain(data: DiscussionDocument): DiscussionMapperToDomain {
    return {
      authorId: data.authorId,
      description: data.description,
      title: data.title,
      comments: [],
      createdAt: data.createdAt,
      downvotes: data.downvotes,
      id: data.id,
      resolution: data.resolution,
      upvotes: data.upvotes,
      updatedAt: data.updatedAt,
    };
  }

  async findById(id: string): Promise<Discussion | null> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) return null;
    const discussion = await this.discussionModel.findById(id);
    if (!discussion) return null;
    return this.mapper.toDomain(this.modelToMapperDomain(discussion));
  }
}
