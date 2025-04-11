import { Module } from '@nestjs/common';
import { DiscussionController } from './controllers/discussion.controller';
import { DiscussionUseCases } from '../application/useCases/discussion.useCases';
import { CreateDiscussionUseCase } from '../application/useCases/createDiscussion/createDiscussion.useCase';
import { UpdateDiscussionUseCase } from '../application/useCases/updateDiscussion/updateDiscussion.useCase';
import { ContextStorageService } from '@modules/shared/domain/contextStorage.service';
import { DiscussionRepository } from '../application/repositories/discussion.repository';
import { SharedModule } from '@modules/shared/infra/shared.module';
import { GetDiscussionByIdUseCase } from '../application/useCases/getDiscussionById/getDiscussionById.useCase';
import { AddCommentUseCase } from '../application/useCases/addComment/addComment.useCase';
import { DatabaseModule } from '@modules/database/infra/database.module';
import { DiscussionMapper } from './mapper/discussion.mapper';
import { CommentRepository } from '../application/repositories/comment.repository';
import { UpdateComment } from '../application/useCases/updateComment/updateComment.useCase';
import { RemoveComment } from '../application/useCases/removeComment/removeComment.useCase';
import { RemoveDiscussion } from '../application/useCases/removeDiscussion/removeDiscussion.useCase';
import { VoteOnDiscussion } from '../application/useCases/voteOnDiscussion/voteOnDiscussion.useCase';
import { VoteOnComment } from '../application/useCases/voteOnComment/voteOnComment.useCase';
import { TransactionService } from '@modules/shared/domain/transaction.service';
import { CommentVoteRepository } from '../application/repositories/commentVote.repository';
import { DiscussionVoteRepository } from '../application/repositories/discussionVote.repository';
import { GetDiscussionsUseCase } from '../application/useCases/getDiscussions/getDiscussions.useCase';

@Module({
  controllers: [DiscussionController],
  imports: [SharedModule, DatabaseModule],
  providers: [
    DiscussionMapper,
    {
      provide: UpdateDiscussionUseCase,
      inject: [ContextStorageService, DiscussionRepository],
      useFactory: (
        context: ContextStorageService,
        discussionRepository: DiscussionRepository,
      ) => new UpdateDiscussionUseCase(context, discussionRepository),
    },
    {
      provide: GetDiscussionByIdUseCase,
      inject: [DiscussionRepository],
      useFactory: (discussionRepository: DiscussionRepository) =>
        new GetDiscussionByIdUseCase(discussionRepository),
    },
    {
      provide: CreateDiscussionUseCase,
      inject: [ContextStorageService, DiscussionRepository],
      useFactory: (
        context: ContextStorageService,
        discussionRepository: DiscussionRepository,
      ) => new CreateDiscussionUseCase(context, discussionRepository),
    },
    {
      provide: AddCommentUseCase,
      useFactory: (
        discussionRepository: DiscussionRepository,
        contextStorageService: ContextStorageService,
        commentRepository: CommentRepository,
        transactionService: TransactionService,
      ) =>
        new AddCommentUseCase(
          discussionRepository,
          contextStorageService,
          commentRepository,
          transactionService,
        ),
      inject: [
        DiscussionRepository,
        ContextStorageService,
        CommentRepository,
        TransactionService,
      ],
    },
    {
      provide: UpdateComment,
      useFactory: (
        commentRepository: CommentRepository,
        contextStorageService: ContextStorageService,
      ) => new UpdateComment(commentRepository, contextStorageService),
      inject: [CommentRepository, ContextStorageService],
    },
    {
      provide: RemoveComment,
      useFactory: (
        commentRepository: CommentRepository,
        contextStorageService: ContextStorageService,
        discussionRepository: DiscussionRepository,
        transactionService: TransactionService,
        commentVoteRepository: CommentVoteRepository,
      ) =>
        new RemoveComment(
          commentRepository,
          contextStorageService,
          discussionRepository,
          commentVoteRepository,
          transactionService,
        ),
      inject: [
        CommentRepository,
        ContextStorageService,
        DiscussionRepository,
        TransactionService,
        CommentVoteRepository,
      ],
    },
    {
      provide: RemoveDiscussion,
      useFactory: (
        discussionRepository: DiscussionRepository,
        commentRepository: CommentRepository,
        contextStorageService: ContextStorageService,
        transactionService: TransactionService,
        commentVoteRepository: CommentVoteRepository,
        discussionVoteRepository: DiscussionVoteRepository,
      ) =>
        new RemoveDiscussion(
          discussionRepository,
          commentRepository,
          contextStorageService,
          transactionService,
          commentVoteRepository,
          discussionVoteRepository,
        ),
      inject: [
        DiscussionRepository,
        CommentRepository,
        ContextStorageService,
        TransactionService,
        CommentVoteRepository,
        DiscussionVoteRepository,
      ],
    },
    {
      provide: VoteOnDiscussion,
      inject: [
        DiscussionRepository,
        ContextStorageService,
        DiscussionVoteRepository,
        TransactionService,
      ],
      useFactory: (
        discussionRepository: DiscussionRepository,
        context: ContextStorageService,
        discussionVoteRepository: DiscussionVoteRepository,
        transactionService: TransactionService,
      ) =>
        new VoteOnDiscussion(
          discussionRepository,
          context,
          discussionVoteRepository,
          transactionService,
        ),
    },
    {
      provide: VoteOnComment,
      inject: [
        CommentRepository,
        CommentVoteRepository,
        ContextStorageService,
        TransactionService,
      ],
      useFactory: (
        commentRepository: CommentRepository,
        commentvoteRepository: CommentVoteRepository,
        context: ContextStorageService,
        transactionService: TransactionService,
      ) => {
        return new VoteOnComment(
          commentRepository,
          commentvoteRepository,
          context,
          transactionService,
        );
      },
    },
    {
      provide: GetDiscussionsUseCase,
      inject: [DiscussionRepository],
      useFactory(discussionRepository: DiscussionRepository) {
        return new GetDiscussionsUseCase(discussionRepository);
      },
    },
    {
      provide: DiscussionUseCases,
      inject: [
        CreateDiscussionUseCase,
        UpdateDiscussionUseCase,
        GetDiscussionByIdUseCase,
        AddCommentUseCase,
        UpdateComment,
        RemoveComment,
        RemoveDiscussion,
        VoteOnDiscussion,
        VoteOnComment,
        GetDiscussionsUseCase,
      ],
      useFactory: (
        createDiscussionUseCase: CreateDiscussionUseCase,
        updateDiscussionUseCase: UpdateDiscussionUseCase,
        getDiscussionByIdUseCase: GetDiscussionByIdUseCase,
        addCommentUseCase: AddCommentUseCase,
        updateComment: UpdateComment,
        removeComment: RemoveComment,
        removeDiscussion: RemoveDiscussion,
        voteOnDiscussion: VoteOnDiscussion,
        voteOnComment: VoteOnComment,
        GetDiscussionsUseCase: GetDiscussionsUseCase,
      ) =>
        new DiscussionUseCases(
          createDiscussionUseCase,
          updateDiscussionUseCase,
          getDiscussionByIdUseCase,
          addCommentUseCase,
          updateComment,
          removeComment,
          removeDiscussion,
          voteOnDiscussion,
          voteOnComment,
          GetDiscussionsUseCase,
        ),
    },
  ],
})
export class DiscussionModule {}
