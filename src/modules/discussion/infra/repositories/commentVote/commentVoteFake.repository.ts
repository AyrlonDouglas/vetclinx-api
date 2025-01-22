import {
  CommentVoteRepository,
  findOneByFilterInput,
} from '@modules/discussion/application/repositories/commentVote.repository';
import { CommentVote } from '@modules/discussion/domain/entities/vote/commentVote.entity';

export class CommentVoteFakeRepository implements CommentVoteRepository {
  constructor(private commentVotes: CommentVote[]) {}

  async save(vote: CommentVote): Promise<string> {
    this.commentVotes.push(vote);
    return vote.props.id;
  }

  async findOneByFilter(filter: findOneByFilterInput): Promise<CommentVote> {
    const result = this.commentVotes.find((commentVote) => {
      if (filter.authorId && filter.commentId) {
        return (
          filter.authorId === commentVote.props.authorId &&
          filter.commentId === commentVote.props.commentId
        );
      }

      if (filter.authorId) {
        return filter.authorId === commentVote.props.authorId;
      }

      if (filter.commentId) {
        return filter.commentId === commentVote.props.commentId;
      }
    });
    return result;
  }

  async deleteById(id: string): Promise<number> {
    const initialCount = this.commentVotes.length;
    this.commentVotes = this.commentVotes.filter(
      (commentVote) => commentVote.props.id !== id,
    );
    return initialCount - this.commentVotes.length;
  }

  async deleteByCommentId(commentId: string | string[]): Promise<number> {
    const initialCount = this.commentVotes.length;

    this.commentVotes = this.commentVotes.filter((commentVote) => {
      if (Array.isArray(commentId)) {
        return !commentId.includes(commentVote.props.commentId);
      }

      return commentVote.props.commentId !== commentId;
    });

    return initialCount - this.commentVotes.length;
  }
}
