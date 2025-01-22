import { UseCase } from '@common/core/useCase';
import {
  RemoveDiscussionInput,
  RemoveDiscussionOutput,
} from './removeDiscussion.dto';
import Inspetor from '@common/core/inspetor';
import { left, right } from '@common/core/either';
import { DiscussionRepository } from '../../repositories/discussion.repository';
import { CommentRepository } from '../../repositories/comment.repository';
import { RemoveDiscussionErrors } from './removeDiscussion.errors';
import { ContextStorageService } from '@modules/shared/domain/contextStorage.service';
import { TransactionService } from '@modules/shared/domain/transaction.service';
import { CommentVoteRepository } from '../../repositories/commentVote.repository';
import { DiscussionVoteRepository } from '../../repositories/discussionVote.repository';

export class RemoveDiscussion
  implements UseCase<RemoveDiscussionInput, RemoveDiscussionOutput>
{
  constructor(
    private readonly discussionRepository: DiscussionRepository,
    private readonly commentRepository: CommentRepository,
    private readonly context: ContextStorageService,
    private readonly transactionService: TransactionService,
    private readonly commentVoteRepository: CommentVoteRepository,
    private readonly discussionVoteRepository: DiscussionVoteRepository,
  ) {}

  async perform(
    input?: RemoveDiscussionInput,
  ): Promise<RemoveDiscussionOutput> {
    const inputOrFail = Inspetor.againstFalsy(
      input.discussionId,
      'discussionId',
    );

    if (inputOrFail.isLeft()) {
      return left(inputOrFail.value);
    }

    const discussion = await this.discussionRepository.findById(
      input.discussionId,
    );

    if (!discussion) {
      return left(
        new RemoveDiscussionErrors.DiscussionNotFoundError(input.discussionId),
      );
    }

    const currentUser = this.context.get('currentUser');

    if (discussion.props.authorId !== currentUser.props.id) {
      return left(new RemoveDiscussionErrors.OnlyCreatorCanDeleteError());
    }

    const comments = await this.commentRepository.findByFilter({
      discussionId: discussion.props.id,
    });
    const commentsIds = comments.map((comment) => comment.props.id);

    await this.transactionService.startTransaction();

    const commentVotesDeleteds =
      await this.commentVoteRepository.deleteByCommentId(commentsIds);

    //FIXME: comentário suato referenciaveis da b.o pq quando vai deletar comentario que tem alguma fk na mesma tabela, da erro
    const commentsDeleteds =
      await this.commentRepository.deleteById(commentsIds);

    const discussionVotesDeleteds =
      await this.discussionVoteRepository.deleteByDiscussionId([
        discussion.props.id,
      ]);

    const discussionDeleted = await this.discussionRepository.deleteById(
      discussion.props.id,
    );

    return right({
      deleted: !!discussionDeleted,
      commentDeletedCount: commentsDeleteds,
      discussionVotesDeleteds,
      commentVotesDeleteds,
    });
  }
}
