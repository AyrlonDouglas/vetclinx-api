import { CommentVote } from '@modules/discussion/domain/entities/vote/commentVote.entity';

export abstract class CommentVoteRepository {
  abstract save(vote: CommentVote): Promise<string>;
  abstract findOneByFilter(filter: findOneByFilterInput): Promise<CommentVote>;
  abstract deleteById(id: string): Promise<number>;
  abstract deleteByCommentId(commentId: string | string[]): Promise<number>;
}

export type findOneByFilterInput = {
  authorId?: string;
  commentId?: string;
};
