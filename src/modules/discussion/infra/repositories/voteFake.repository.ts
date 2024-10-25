import {
  findOneByFilterInput,
  VoteRepository,
} from '@modules/discussion/application/repositories/vote.repository';
import { Vote } from '@modules/discussion/domain/entities/vote/vote.entity';
import { randomUUID } from 'crypto';

export class VoteFakeRepository implements VoteRepository {
  constructor(private votes: Vote[]) {}

  async save(vote: Vote): Promise<string> {
    if (vote.props.id) {
      const index = this.votes.findIndex(
        (voteEl) => voteEl.props.id === vote.props.id,
      );

      if (index) {
        this.votes[index] = vote;
      }

      return vote.props.id;
    }

    const newVote = Vote.create({
      user: vote.props.user,
      voteFor: vote.props.voteFor,
      voteForReferency: vote.props.voteForReferency,
      voteType: vote.props.voteType,
      createdAt: vote.props.createdAt,
      id: randomUUID().toString(),
      updatedAt: vote.props.updatedAt,
    }).value as Vote;

    return newVote.props.id;
  }

  async findOneByFilter(filter: findOneByFilterInput): Promise<Vote> {
    return this.votes.filter(
      (voteEl) =>
        (filter.user ? voteEl.props.user === filter.user : true) &&
        (filter.voteFor ? voteEl.props.voteFor === filter.voteFor : true) &&
        (filter.voteForReferency
          ? voteEl.props.voteForReferency === filter.voteForReferency
          : true),
    )[0];
  }

  async deleteById(id: string): Promise<number> {
    const newList = this.votes.filter((vote) => vote.props.id !== id);
    const countDeleted = this.votes.length - newList.length;
    this.votes = newList;
    return countDeleted;
  }

  async deleteByVoteForReferency(
    voteForReferencyList: string[],
  ): Promise<number> {
    const newList = this.votes.filter(
      (vote) => !voteForReferencyList.includes(vote.props.voteForReferency),
    );
    const countDeleted = this.votes.length - newList.length;
    this.votes = newList;
    return countDeleted;
  }
}
