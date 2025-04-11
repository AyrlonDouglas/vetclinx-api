import { UseCase } from '@common/core/useCase';
import {
  VoteTheDiscussionInput,
  VoteTheDiscussionOutput,
} from './voteOnDiscussion.dto';
import Inspector from '@common/core/inspector';
import { left, right } from '@common/core/either';
import { DiscussionRepository } from '../../repositories/discussion.repository';
import { VoteOnDiscussionError } from './voteOnDiscussion.errors';
import { VoteTypes } from '@modules/discussion/domain/component/voteManager.component';
import { ContextStorageService } from '@modules/shared/domain/contextStorage.service';
import { TransactionService } from '@modules/shared/domain/transaction.service';
import { DiscussionVoteRepository } from '../../repositories/discussionVote.repository';
import { DiscussionVote } from '@modules/discussion/domain/entities/vote/discussionVote.entity';
import DiscussionErrors from '../discussion.errors';

export class VoteOnDiscussion
  implements UseCase<VoteTheDiscussionInput, VoteTheDiscussionOutput>
{
  constructor(
    private readonly discussionRepository: DiscussionRepository,
    private readonly context: ContextStorageService,
    private readonly discussionVoteRepository: DiscussionVoteRepository,
    private readonly transactionService: TransactionService,
  ) {}

  async perform(
    input: VoteTheDiscussionInput,
  ): Promise<VoteTheDiscussionOutput> {
    const inputOrFail = Inspector.againstFalsyBulk([
      { argument: input.discussionId, argumentName: 'discussionId' },
      { argument: input.voteType, argumentName: 'voteType' },
    ]);

    if (inputOrFail.isLeft()) {
      return left(inputOrFail.value);
    }

    const isOneOfOrFail = Inspector.isOneOf(
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
      return left(new DiscussionErrors.DiscussionNotFoundError());
    }
    const currentUser = this.context.get('currentUser');

    if (discussion.props.authorId === currentUser.props.id) {
      return left(new VoteOnDiscussionError.CreatorCannotVoteYourDiscussion());
    }

    await this.transactionService.startTransaction();

    const existingVote = await this.discussionVoteRepository.findOneByFilter({
      authorId: currentUser.props.id,
      discussionId: discussion.props.id,
    });

    if (existingVote) {
      if (existingVote.props.voteType === input.voteType) {
        discussion.removeVote(existingVote);
        await this.discussionVoteRepository.deleteById(existingVote.props.id);
      } else {
        const from = existingVote.props.voteType;
        const to = from === VoteTypes.down ? VoteTypes.up : VoteTypes.down;
        discussion.exchangeVote(from, to);
        existingVote.setVoteType(to);
        await this.discussionVoteRepository.save(existingVote);
      }
    } else {
      const newVote = DiscussionVote.create({
        authorId: currentUser.props.id,
        voteType: input.voteType,
        discussionId: discussion.props.id,
      });

      if (newVote.isLeft()) {
        return left(newVote.value);
      } else {
        await this.discussionVoteRepository.save(newVote.value);
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
