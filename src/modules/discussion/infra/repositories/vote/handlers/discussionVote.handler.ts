import { DiscussionVote } from '@modules/database/infra/posgreSQL/entities/discussionVote.db';
import { BaseVoteHandler } from './baseVote.handler';
import { Vote } from '@modules/discussion/domain/entities/vote/vote.entity';
import { EntityManager, Repository } from 'typeorm';
import { VoteFor } from '@modules/discussion/domain/component/voteManager.component';
import BaseError from '@common/errors/baseError.error';
import { HttpStatusCode } from '@common/http/httpStatusCode';

export class DiscussionVoteHandler extends BaseVoteHandler<DiscussionVote> {
  createEntity(vote: Vote): DiscussionVote {
    const discussionVote = new DiscussionVote();
    discussionVote.discussionId = +vote.props.voteForReferency;
    discussionVote.userId = +vote.props.user;
    discussionVote.voteType = vote.props.voteType;

    if (vote.props.id) {
      discussionVote.id = +vote.props.id;
    }
    return discussionVote;
  }

  getRepository(entityManager: EntityManager): Repository<DiscussionVote> {
    return entityManager.withRepository(
      entityManager.getRepository(DiscussionVote),
    );
  }

  toDomain(voteDB: DiscussionVote): Vote {
    const vote = Vote.create({
      user: voteDB.userId.toString(),
      voteFor: VoteFor.discussion,
      voteForReferency: voteDB.discussionId.toString(),
      voteType: voteDB.voteType,
      id: voteDB.id.toString(),
    });

    if (vote.isLeft()) {
      throw new BaseError(
        ['Error in DiscussionVoteHandler.toDomain'],
        HttpStatusCode.CONFLICT,
      );
    }

    return vote.value;
  }
}
