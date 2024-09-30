import { Mapper } from '@common/infra/Mapper';
import { UserMapper } from '@modules/user/infra/mapper/user.mapper';
import { Comment } from '@modules/discussion/domain/entities/comment/comment.entity';
import { CommentDocument, CommentModel } from '../schemas/comment.schema';
import { DiscussionMapper } from './discussion.mapper';
import { Types } from 'mongoose';

export class CommentMapper implements Mapper<Comment> {
  userMapper = new UserMapper();
  discussionMapper = new DiscussionMapper();

  toPersistense(data: Comment): CommentModel {
    const comment = new CommentModel();
    comment.author = this.discussionMapper.mapAuthorToObjectId(
      data.props.authorId,
    );
    comment.createdAt = data.props.createdAt;
    comment.updatedAt = data.props.updatedAt;
    comment.content = data.props.content;
    comment.discussion = this.discussionMapper.mapDiscussionToObjectId(
      data.props.discussionId,
    );
    comment.downvotes = data.props.downvotes;
    comment.upvotes = data.props.upvotes;
    comment.commentCount = data.props.commentCount;
    comment.parentCommentId = this.mapCommentToObjectId(
      data.props.parentCommentId,
    );
    return comment;
  }

  toDomain(data: CommentDocument): Comment {
    return Comment.create({
      authorId: data.author._id.toString(),
      content: data.content,
      discussionId: data.discussion._id.toString(),
      createdAt: data.createdAt,
      downvotes: data.downvotes,
      id: data._id.toString(),
      updatedAt: data.updatedAt,
      upvotes: data.upvotes,
      commentCount: data.commentCount,
      parentCommentId: this.mapObjectIdToComment(data.parentCommentId),
    }).value as Comment;
  }

  toDTO(data: Comment) {
    return data;
  }

  mapCommentToObjectId(comment: string | Comment): Types.ObjectId {
    if (!comment) return;
    if (comment instanceof Comment) {
      return new Types.ObjectId(comment.props.id);
    }
    return new Types.ObjectId(comment);
  }

  mapObjectIdToComment(comment: Types.ObjectId): string {
    if (!comment) return;

    if (comment instanceof Types.ObjectId) {
      return comment.toString();
    }
  }
}
