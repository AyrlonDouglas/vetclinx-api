import { Comment } from '@modules/discussion/domain/entities/comment/comment.entity';

export abstract class CommentRepository {
  abstract save(comment: Comment): Promise<string>;
  abstract findById(id: string): Promise<Comment | null>;
  abstract deleteById(id: string): Promise<number>;
}
