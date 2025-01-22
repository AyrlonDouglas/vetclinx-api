import { DiscussionVote } from '@modules/discussion/domain/entities/vote/discussionVote.entity';

export abstract class DiscussionVoteRepository {
  abstract save(vote: DiscussionVote): Promise<string>;
  abstract findOneByFilter(
    filter: findOneByFilterInput,
  ): Promise<DiscussionVote>;
  abstract deleteById(id: string): Promise<number>;
  abstract deleteByDiscussionId(
    discussionId: string[] | string,
  ): Promise<number>;
}

export type findOneByFilterInput = {
  authorId?: string;
  discussionId?: string;
};
