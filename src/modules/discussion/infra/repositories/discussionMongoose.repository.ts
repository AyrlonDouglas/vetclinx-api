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

  mongooseToDomain(data: DiscussionDocument): DiscussionMapperToDomain {
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
    };
  }
  //FIXME: Savar nova discussão não funciona
  //TODO: criar métodos diferentes para salvar e atualizar!
  async save(discussion: Discussion): Promise<string> {
    const { id, ...discussionToPersistence } =
      this.mapper.toPersistense(discussion);

    const filter = {
      _id: id,
    };
    const options = {
      upsert: true, // Cria um novo documento se não houver um existente
      new: true, // Retorna o documento atualizado
      setDefaultsOnInsert: true,
    };
    const update = { $set: discussionToPersistence };

    const savedOrCreatedDiscussion =
      await this.discussionModel.findOneAndUpdate(filter, update, options);

    return savedOrCreatedDiscussion._id.toString();
  }

  async findById(id: string): Promise<Discussion | null> {
    const isValidId = Types.ObjectId.isValid(id);
    if (!isValidId) return null;
    const discussion = await this.discussionModel.findById(id);
    if (!discussion) return null;
    return this.mapper.toDomain(this.mongooseToDomain(discussion));
  }
}
