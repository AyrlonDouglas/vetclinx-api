import { CommentRepository } from '@modules/discussion/application/repositories/comment.repository';
import { Comment } from '@modules/discussion/domain/entities/comment/comment.entity';
import { randomUUID } from 'crypto';

export class CommentFakeRepository implements CommentRepository {
  constructor(private commentList: Comment[] = []) {}
  async deleteById(id: string): Promise<number> {
    const lengthOld = this.commentList.length;
    this.commentList = this.commentList.filter((el) => el.props.id !== id);

    const lengthNew = this.commentList.length;

    return lengthOld - lengthNew;
  }

  async findById(id: string): Promise<Comment | null> {
    return this.commentList.find((el) => el.props.id === id);
  }
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
