import { CommentRepository } from '@modules/discussion/application/repositories/comment.repository';
import { Comment } from '@modules/discussion/domain/entities/comment/comment.entity';
import { randomUUID } from 'crypto';

export class CommentFakeRepository implements CommentRepository {
  commentList: Comment[];
  async save(comment: Comment): Promise<string> {
    const newComment = Comment.create({
      authorId: comment.props.authorId,
      content: comment.props.content,
      discussionId: comment.props.discussionId,
      id: randomUUID(),
    }).value as Comment;

    this.commentList.push(newComment);

    return newComment.props.id;
  }
}
