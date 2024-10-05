import { UseCase } from '@common/core/useCase';
import {
  VoteTheDiscussionInput,
  VoteTheDiscussionOutput,
} from './voteTheDiscussion.dto';
import Inspetor from '@common/core/inspetor';
import { left, right } from '@common/core/either';
import { DiscussionRepository } from '../../repositories/discussion.repository';
import { VoteTheDiscussionError } from './voteTheDiscussion.errors';
import {
  VoteFor,
  VoteTypes,
} from '@modules/discussion/domain/component/voteManager.component';
import { ContextStorageService } from '@modules/shared/domain/contextStorage.service';
import User from '@modules/user/domain/entities/user.entity';
import { VoteRepository } from '../../repositories/vote.repository';
import { Vote } from '@modules/discussion/domain/entities/vote/vote.entity';

export class VoteTheDiscussion
  implements UseCase<VoteTheDiscussionInput, VoteTheDiscussionOutput>
{
  constructor(
    private readonly discussionRepository: DiscussionRepository,
    private readonly context: ContextStorageService,
    private readonly voteRepository: VoteRepository,
  ) {}

  async perform(
    input?: VoteTheDiscussionInput,
  ): Promise<VoteTheDiscussionOutput> {
    const inputOrFail = Inspetor.againstFalsyBulk([
      { argument: input.discussionId, argumentName: 'discussionId' },
      { argument: input.vote, argumentName: 'vote' },
    ]);

    if (inputOrFail.isLeft()) {
      return left(inputOrFail.value);
    }

    const discussion = await this.discussionRepository.findById(
      input.discussionId,
    );

    if (!discussion) {
      return left(
        new VoteTheDiscussionError.DiscussionNotFoundError(input.discussionId),
      );
    }
    const currentUser = this.context.get('currentUser') as User;

    if (discussion.props.authorId === currentUser.props.id) {
      return left(new VoteTheDiscussionError.CreatorCannotVoteYourDiscussion());
    }

    const existingVote = await this.voteRepository.findOneByFilter({
      user: currentUser.props.id,
      voteFor: VoteFor.discussion,
      voteForReferency: discussion.props.id,
    });

    //TODO: Necessario transaction aqui
    //TODO: precisa testar esse logica abaixo
    /**
     * Regras
     * Se usuario nao tiver votado:
     *  - criar voto
     *  - adicionar voto em discussao
     *
     * Se usuario tiver votado
     *  - Se o votoType for igual ao voto votado, remover voto e remover da discussao
     *  - se o voteType não for igual, trocar voteType do voto e dos votos da discussão
     */
    if (existingVote) {
      if (existingVote.props.voteType === input.vote) {
        discussion.removeVote(existingVote);
        await this.voteRepository.deleteById(existingVote.props.id);
      } else {
        const from = existingVote.props.voteType;
        const to = from === VoteTypes.down ? VoteTypes.up : VoteTypes.down;
        discussion.exchangeVote(from, to);
        existingVote.setVoteType(to);
        await this.voteRepository.save(existingVote);
      }
    } else {
      const newVote = Vote.create({
        user: currentUser.props.id,
        voteFor: VoteFor.discussion,
        voteType: input.vote,
        voteForReferency: discussion.props.id,
      });

      if (newVote.isLeft()) {
        return left(newVote.value);
      } else {
        await this.voteRepository.save(newVote.value);
      }

      if (input.vote === VoteTypes.up) {
        discussion.upvote();
      } else {
        discussion.downvote();
      }
    }

    const discussionUpdated = await this.discussionRepository.save(discussion);

    return right({ id: discussionUpdated });
  }
}
