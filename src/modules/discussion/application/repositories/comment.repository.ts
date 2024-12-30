import { Comment } from '@modules/discussion/domain/entities/comment/comment.entity';

export abstract class CommentRepository {
  abstract save(comment: Comment): Promise<string>;
  abstract findById(id: string): Promise<Comment | null>;
  abstract deleteById(id: string | string[]): Promise<number>;
  abstract deleteByDiscussionId(discussionId: string): Promise<number>;
  abstract deleteByParentCommentId(parentCommentId: string): Promise<number>;
  abstract findChildrenCommentsByCommentId(
    id: string,
  ): Promise<Comment[] | null>;
  abstract findByFilter(filter: findByFilterInput): Promise<Comment[]>;
}

export type findByFilterInput = {
  discussionId: string;
};
