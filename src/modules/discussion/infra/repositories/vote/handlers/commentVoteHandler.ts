import { CommentVote } from '@modules/database/infra/posgreSQL/entities/commentVote.db.entity';
import { BaseVoteHandler } from './baseVote.handler';
import { Vote } from '@modules/discussion/domain/entities/vote/vote.entity';
import { EntityManager, Repository } from 'typeorm';
import { VoteFor } from '@modules/discussion/domain/component/voteManager.component';
import BaseError from '@common/errors/baseError.error';
import { HttpStatusCode } from '@common/http/httpStatusCode';

export class CommentVoteHandler extends BaseVoteHandler<CommentVote> {
  createEntity(vote: Vote): CommentVote {
    const commentVote = new CommentVote();
    commentVote.commentId = +vote.props.voteForReferency;
    commentVote.userId = +vote.props.user;
    commentVote.voteType = vote.props.voteType;

    if (vote.props.id) {
      commentVote.id = +vote.props.id;
    }

    return commentVote;
  }

  getRepository(entityManager: EntityManager): Repository<CommentVote> {
    return entityManager.withRepository(
      entityManager.getRepository(CommentVote),
    );
  }

  toDomain(voteDB: CommentVote): Vote {
    const vote = Vote.create({
      user: voteDB.userId.toString(),
      voteFor: VoteFor.comment,
      voteForReferency: voteDB.id.toString(),
      voteType: voteDB.voteType,
    });

    if (vote.isLeft()) {
      throw new BaseError(
        ['Error in commentVoteHandler.toDomain'],
        HttpStatusCode.CONFLICT,
      );
    }

    return vote.value;
  }
}
