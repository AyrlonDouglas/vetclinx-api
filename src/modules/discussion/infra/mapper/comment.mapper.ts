import { Mapper } from '@common/infra/Mapper';
import { UserMapper } from '@modules/user/infra/mapper/user.mapper';
import { Comment } from '@modules/discussion/domain/entities/comment/comment.entity';
import { CommentDocument, CommentModel } from '../schemas/comment.schema';
import { DiscussionMapper } from './discussion.mapper';

export class CommentMapper implements Mapper<Comment> {
  userMapper = new UserMapper();
  discussionMapper = new DiscussionMapper();

  toPersistense(data: Comment): CommentModel {
    const comment = new CommentModel();
    comment.author = this.discussionMapper.mapAuthorToObjectId(
      data.props.author,
    );
    comment.createdAt = data.props.createdAt;
    comment.updatedAt = data.props.updatedAt;
    comment.content = data.props.content;
    comment.discussion = this.discussionMapper.mapDiscussionToObjectId(
      data.props.discussion,
    );
    comment.downvotes = data.props.downvotes;
    comment.upvotes = data.props.upvotes;
    return comment;
  }

  toDomain(data: CommentDocument): Comment {
    return Comment.create({
      author: this.discussionMapper.mapObjectIdToAuthor(data.author),
      content: data.content,
      discussion: this.discussionMapper.mapObjectIdToDiscussion(
        data.discussion,
      ),
      createdAt: data.createdAt,
      downvotes: data.downvotes,
      id: data._id.toString(),
      updatedAt: data.updatedAt,
      upvotes: data.upvotes,
    }).value as Comment;
  }

  toDTO(data: Comment) {
    return data;
  }
}
