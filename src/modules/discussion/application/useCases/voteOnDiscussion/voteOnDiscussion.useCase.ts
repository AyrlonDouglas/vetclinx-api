import { UseCase } from '@common/core/useCase';
import {
  VoteTheDiscussionInput,
  VoteTheDiscussionOutput,
} from './voteOnDiscussion.dto';
import Inspetor from '@common/core/inspetor';
import { left, right } from '@common/core/either';
import { DiscussionRepository } from '../../repositories/discussion.repository';
import { VoteOnDiscussionError } from './voteOnDiscussion.errors';
import {
  VoteFor,
  VoteTypes,
} from '@modules/discussion/domain/component/voteManager.component';
import { ContextStorageService } from '@modules/shared/domain/contextStorage.service';
import User from '@modules/user/domain/entities/user.entity';
import { VoteRepository } from '../../repositories/vote.repository';
import { Vote } from '@modules/discussion/domain/entities/vote/vote.entity';
import { TransactionService } from '@modules/shared/domain/transaction.service';

export class VoteOnDiscussion
  implements UseCase<VoteTheDiscussionInput, VoteTheDiscussionOutput>
{
  constructor(
    private readonly discussionRepository: DiscussionRepository,
    private readonly context: ContextStorageService,
    private readonly voteRepository: VoteRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async perform(
    input: VoteTheDiscussionInput,
  ): Promise<VoteTheDiscussionOutput> {
    const inputOrFail = Inspetor.againstFalsyBulk([
      { argument: input.discussionId, argumentName: 'discussionId' },
      { argument: input.voteType, argumentName: 'voteType' },
    ]);

    if (inputOrFail.isLeft()) {
      return left(inputOrFail.value);
    }

    const isOneOfOrFail = Inspetor.isOneOf(
      input.voteType,
      Object.values(VoteTypes),
      'voteType',
    );

    if (isOneOfOrFail.isLeft()) {
      return left(isOneOfOrFail.value);
    }

    const discussion = await this.discussionRepository.findById(
      input.discussionId,
    );

    if (!discussion) {
      return left(
        new VoteOnDiscussionError.DiscussionNotFoundError(input.discussionId),
      );
    }
    const currentUser = this.context.get('currentUser') as User;

    if (discussion.props.authorId === currentUser.props.id) {
      return left(new VoteOnDiscussionError.CreatorCannotVoteYourDiscussion());
    }

    await this.transactionService.startTransaction();

    const existingVote = await this.voteRepository.findOneByFilter({
      user: currentUser.props.id,
      voteFor: VoteFor.discussion,
      voteForReferency: discussion.props.id,
    });

    if (existingVote) {
      if (existingVote.props.voteType === input.voteType) {
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
        voteType: input.voteType,
        voteForReferency: discussion.props.id,
      });

      if (newVote.isLeft()) {
        return left(newVote.value);
      } else {
        await this.voteRepository.save(newVote.value);
      }

      if (input.voteType === VoteTypes.up) {
        discussion.upvote();
      } else {
        discussion.downvote();
      }
    }

    const discussionUpdated = await this.discussionRepository.save(discussion);

    return right({ id: discussionUpdated });
  }
}
