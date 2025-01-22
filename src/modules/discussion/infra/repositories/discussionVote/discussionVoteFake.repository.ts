import {
  DiscussionVoteRepository,
  findOneByFilterInput,
} from '@modules/discussion/application/repositories/discussionVote.repository';
import { DiscussionVote } from '@modules/discussion/domain/entities/vote/discussionVote.entity';

export class DiscussionVoteFakeRepository implements DiscussionVoteRepository {
  constructor(private discussionVotes: DiscussionVote[]) {}

  async save(vote: DiscussionVote): Promise<string> {
    this.discussionVotes.push(vote);
    return vote.props.id;
  }

  async findOneByFilter(filter: findOneByFilterInput): Promise<DiscussionVote> {
    return this.discussionVotes.find((discussionVote) => {
      if (filter.authorId && filter.discussionId) {
        return (
          filter.authorId === discussionVote.props.authorId &&
          filter.discussionId === discussionVote.props.discussionId
        );
      }

      if (filter.authorId) {
        return filter.authorId === discussionVote.props.authorId;
      }

      if (filter.discussionId) {
        return filter.discussionId === discussionVote.props.discussionId;
      }
    });
  }

  async deleteById(id: string): Promise<number> {
    const initialCount = this.discussionVotes.length;
    this.discussionVotes = this.discussionVotes.filter(
      (discussionVote) => discussionVote.props.id !== id,
    );
    return this.discussionVotes.length - initialCount;
  }

  async deleteByDiscussionId(discussionId: string | string[]): Promise<number> {
    const initialCount = this.discussionVotes.length;
    this.discussionVotes = this.discussionVotes.filter(
      (discussionVote) => discussionVote.props.discussionId !== discussionId,
    );
    return this.discussionVotes.length - initialCount;
  }
}
