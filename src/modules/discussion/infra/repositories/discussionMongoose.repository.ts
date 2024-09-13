import { DiscussionRepository } from '@modules/discussion/application/repositories/discussion.repository';
import { Discussion } from '@modules/discussion/domain/entities/discussion/discussion.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DiscussionModel } from '../schemas/discussion.schema';
import { DiscussionMapper } from '../mapper/discussion.mapper';
import { CommentModel } from '../schemas/comment.schema';
import { Comment } from '@modules/discussion/domain/entities/comment/comment.entity';
import { CommentMapper } from '../mapper/comment.mapper';
export class DiscussionMongooseRepository implements DiscussionRepository {
  discussionMapper = new DiscussionMapper();
  commentMapper = new CommentMapper();

  constructor(
    @InjectModel(DiscussionModel.name)
    private readonly discussionModel: Model<DiscussionModel>,

    @InjectModel(CommentModel.name)
    private readonly commentModel: Model<CommentModel>,
  ) {}

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
    for (const comment of discussion.props.comments) {
      await this.addComment(comment);
    }

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

  private async addComment(comment: Comment) {
    const newComment = new CommentModel();
    newComment.author = this.discussionMapper.mapAuthorToObjectId(
      comment.props.author,
    );
    newComment.content = comment.props.content;
    newComment.createdAt = comment.props.createdAt;
    newComment.discussion = this.discussionMapper.mapDiscussionToObjectId(
      comment.props.id,
    );
    newComment.downvotes = comment.props.downvotes;
    newComment.upvotes = comment.props.upvotes;

    const commentCreated = await this.commentModel.create(newComment);

    return commentCreated.id;
  }
}
