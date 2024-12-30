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

  async deleteById(id: string | string[]): Promise<number> {
    const lengthOld = this.commentList.length;
    this.commentList = this.commentList.filter((el) => {
      if (Array.isArray(id)) {
        return !id.some((id) => id === el.props.id);
      }

      return el.props.id !== id;
    });

    const lengthNew = this.commentList.length;

    return lengthOld - lengthNew;
  }

  async findById(id: string): Promise<Comment | null> {
    return this.commentList.find((el) => el.props.id === id);
  }

  async save(comment: Comment): Promise<string> {
    let commentId = comment.props.id;

    if (!comment.props.id) {
      const newComment = Comment.create({
        authorId: comment.props.authorId,
        content: comment.props.content,
        discussionId: comment.props.discussionId,
        id: randomUUID().toString(),
      }).value as Comment;

      commentId = newComment.props.id;
      this.commentList.push(newComment);
    } else {
      const existingComment = await this.findById(comment.props.id);

      if (existingComment) {
        const updateComment = Comment.create({
          authorId: comment.props.authorId ?? existingComment.props.authorId,
          content: comment.props.content ?? existingComment.props.content,
          discussionId:
            comment.props.discussionId ?? existingComment.props.discussionId,
          commentCount:
            comment.props.commentCount ?? existingComment.props.commentCount,
          createdAt: comment.props.createdAt ?? existingComment.props.createdAt,
          downvotes: comment.props.downvotes ?? existingComment.props.downvotes,
          id: comment.props.id ?? existingComment.props.id,
          parentCommentId:
            comment.props.parentCommentId ??
            existingComment.props.parentCommentId,
          updatedAt: comment.props.updatedAt ?? existingComment.props.updatedAt,
          upvotes: comment.props.upvotes ?? existingComment.props.upvotes,
        }).value as Comment;

        this.commentList = this.commentList.filter(
          (el) => el.props.id !== existingComment.props.id,
        );

        this.commentList.push(updateComment);
      }
    }

    return commentId;
  }
}
