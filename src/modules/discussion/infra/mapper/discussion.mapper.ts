import { Mapper } from '@common/infra/Mapper';
import { Discussion } from '@modules/discussion/domain/entities/discussion/discussion.entity';
import {
  DiscussionDocument,
  DiscussionModel,
} from '../schemas/discussion.schema';
import { Types } from 'mongoose';
import User from '@modules/user/domain/entities/user.entity';
import { UserDocument } from '@modules/user/infra/schemas/user.schema';
import { UserMapper } from '@modules/user/infra/mapper/user.mapper';

export class DiscussionMapper implements Mapper<Discussion> {
  userMapper = new UserMapper();

  toPersistense(data: Discussion): DiscussionModel {
    const discussionDocument = new DiscussionModel();
    discussionDocument.author = this.mapAuthorToObjectId(data.props.authorId);
    discussionDocument.createdAt = data.props.createdAt;
    discussionDocument.description = data.props.description;
    discussionDocument.downvotes = data.props.downvotes;
    discussionDocument.resolution = data.props.resolution;
    discussionDocument.title = data.props.title;
    discussionDocument.updatedAt = data.props.updatedAt;
    discussionDocument.upvotes = data.props.upvotes;
    discussionDocument.commentCount = data.props.commentCount;

    return discussionDocument;
  }

  toDomain(data: DiscussionDocument): Discussion {
    return Discussion.create({
      authorId: data.author._id.toString(),
      description: data.description,
      title: data.title,
      createdAt: data.createdAt,
      downvotes: data.downvotes,
      id: data._id.toString(),
      resolution: data.resolution,
      updatedAt: data.updatedAt,
      upvotes: data.upvotes,
      commentCount: data.commentCount,
    }).value as Discussion;
  }

  toDTO(data: Discussion) {
    return data;
  }

  mapDiscussionToObjectId(discussion: string | Discussion): Types.ObjectId {
    if (!discussion) return;
    if (discussion instanceof Discussion) {
      return new Types.ObjectId(discussion.props.id);
    }
    return new Types.ObjectId(discussion);
  }

  mapObjectIdToDiscussion(
    discussion: DiscussionDocument | Types.ObjectId,
  ): string | Discussion {
    if (!discussion) return;

    if (discussion instanceof Types.ObjectId) {
      return discussion.toString();
    }
    return this.toDomain(discussion);
  }

  mapAuthorToObjectId(author: string | User): Types.ObjectId {
    if (!author) return;

    if (author instanceof User) {
      return new Types.ObjectId(author.props.id);
    }
    return new Types.ObjectId(author);
  }

  mapObjectIdToAuthor(author: UserDocument | Types.ObjectId): string | User {
    if (!author) return;

    if (author instanceof Types.ObjectId) {
      return author.toString();
    }
    return this.userMapper.toDomain(author);
  }
}
