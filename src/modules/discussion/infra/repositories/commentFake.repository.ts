import {
  CommentRepository,
  findByFilterInput,
} from '@modules/discussion/application/repositories/comment.repository';
import { Comment } from '@modules/discussion/domain/entities/comment/comment.entity';
import { randomUUID } from 'crypto';

export class CommentFakeRepository implements CommentRepository {
  constructor(private commentList: Comment[] = []) {}
  async findByFilter(filter: findByFilterInput): Promise<Comment[]> {
    return this.commentList.filter(
      (commentEl) => filter.discussionId === commentEl.props.discussionId,
    );
  }

  async deleteByDiscussionId(discussionId: string): Promise<number> {
    const newList = this.commentList.filter(
      (commentEl) => commentEl.props.discussionId !== discussionId,
    );

    const countDeleted = this.commentList.length - newList.length;
    this.commentList = newList;
    return countDeleted;
  }

  async deleteByParentCommentId(parentCommentId: string): Promise<number> {
    const newList = this.commentList.filter(
      (commentEl) => commentEl.props.parentCommentId !== parentCommentId,
    );

    const countDeleted = this.commentList.length - newList.length;
    this.commentList = newList;
    return countDeleted;
  }

  async findChildrenCommentsByCommentId(id: string): Promise<Comment[] | null> {
    const found = this.commentList.filter(
      (commentEl) => commentEl.props.parentCommentId === id,
    );
    return found.length ? found : null;
  }

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
      id: randomUUID().toString(),
    }).value as Comment;

    this.commentList.push(newComment);

    return newComment.props.id;
  }
}
