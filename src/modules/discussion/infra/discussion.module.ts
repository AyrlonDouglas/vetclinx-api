import { Module } from '@nestjs/common';
import { DiscussionController } from './controllers/discussion.controller';
import { DiscussionUseCases } from '../application/useCases/discussion.useCases';
import { CreateDiscussionUseCase } from '../application/useCases/createDiscussion/createDiscussion.useCase';
import { UpdateDiscussionUseCase } from '../application/useCases/updateDiscussion/updateDiscussion.useCase';
import { ContextStorageService } from '@modules/shared/domain/contextStorage.service';
import { DiscussionRepository } from '../application/repositories/discussion.repository';
import { SharedModule } from '@modules/shared/infra/shared.module';
import { GetDiscussionByIdUseCase } from '../application/useCases/getDiscussionById/getDiscussionById.useCase';
// import { DiscussionMongooseRepository } from './repositories/discussionMongoose.repository';
import { AddCommentUseCase } from '../application/useCases/addComment/addComment.useCase';
import { DatabaseModule } from '@modules/database/infra/database.module';
import { DiscussionMapper } from './mapper/discussion.mapper';
import { CommentRepository } from '../application/repositories/comment.repository';
// import { CommentMongooseRepository } from './repositories/commentMongoose.repository';
import { UpdateComment } from '../application/useCases/updateComment/updateComment.useCase';
import { RemoveComment } from '../application/useCases/removeComment/removeComment.useCase';
import { RemoveDiscussion } from '../application/useCases/removeDiscussion/removeDiscussion.useCase';
import { VoteOnDiscussion } from '../application/useCases/voteOnDiscussion/voteOnDiscussion.useCase';
import { VoteRepository } from '../application/repositories/vote.repository';
import { VoteOnComment } from '../application/useCases/voteOnComment/voteOnComment.useCase';
import { TransactionService } from '@modules/shared/domain/transaction.service';
import { VoteFakeRepository } from './repositories/voteFake.repository';

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
      ) =>
        new AddCommentUseCase(
          discussionRepository,
          contextStorageService,
          commentRepository,
        ),
      inject: [DiscussionRepository, ContextStorageService, CommentRepository],
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
        voteRepository: VoteRepository,
        transactionService: TransactionService,
      ) =>
        new RemoveComment(
          commentRepository,
          contextStorageService,
          discussionRepository,
          voteRepository,
          transactionService,
        ),
      inject: [
        CommentRepository,
        ContextStorageService,
        DiscussionRepository,
        VoteRepository,
        TransactionService,
      ],
    },
    {
      provide: RemoveDiscussion,
      useFactory: (
        discussionRepository: DiscussionRepository,
        commentRepository: CommentRepository,
        contextStorageService: ContextStorageService,
        voteRepository: VoteRepository,
        transactionService: TransactionService,
      ) =>
        new RemoveDiscussion(
          discussionRepository,
          commentRepository,
          contextStorageService,
          voteRepository,
          transactionService,
        ),
      inject: [
        DiscussionRepository,
        CommentRepository,
        ContextStorageService,
        VoteRepository,
        TransactionService,
      ],
    },
    // VoteMongooseRepository,
    { provide: VoteRepository, useClass: VoteFakeRepository }, //TODO: implementar não fake
    {
      provide: VoteOnDiscussion,
      inject: [
        DiscussionRepository,
        ContextStorageService,
        VoteRepository,
        TransactionService,
      ],
      useFactory: (
        discussionRepository: DiscussionRepository,
        context: ContextStorageService,
        voteRepository: VoteRepository,
        transactionService: TransactionService,
      ) =>
        new VoteOnDiscussion(
          discussionRepository,
          context,
          voteRepository,
          transactionService,
        ),
    },
    {
      provide: VoteOnComment,
      inject: [
        CommentRepository,
        VoteRepository,
        ContextStorageService,
        TransactionService,
      ],
      useFactory: (
        commentRepository: CommentRepository,
        voteRepository: VoteRepository,
        context: ContextStorageService,
        transactionService: TransactionService,
      ) =>
        new VoteOnComment(
          commentRepository,
          voteRepository,
          context,
          transactionService,
        ),
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
        ),
    },
  ],
})
export class DiscussionModule {}
