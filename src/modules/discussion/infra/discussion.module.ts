import { Module } from '@nestjs/common';
import { DiscussionController } from './controllers/discussion.controller';
import { DiscussionUseCases } from '../application/useCases/discussion.useCases';
import { CreateDiscussionUseCase } from '../application/useCases/createDiscussion/createDiscussion.useCase';
import { UpdateDiscussionUseCase } from '../application/useCases/updateDiscussion/updateDiscussion.useCase';
import { ContextStorageService } from '@modules/shared/domain/contextStorage.service';
import { DiscussionRepository } from '../application/repositories/discussion.repository';
import { SharedModule } from '@modules/shared/infra/shared.module';
import { GetDiscussionByIdUseCase } from '../application/useCases/getDiscussionById/getDiscussionById.useCase';
import { DiscussionMapper } from '../application/mappers/discussion.mapper';
import { DiscussionMongooseRepository } from './repositories/discussionMongoose.repository';
// import { MongooseModule } from '@nestjs/mongoose';
// import { DiscussionModel, DiscussionSchema } from './schemas/discussion.schema';
import { AddCommentUseCase } from '../application/useCases/addComment/addComment.useCase';
import { DatabaseModule } from '@modules/database/infra/database.module';

@Module({
  controllers: [DiscussionController],
  imports: [
    SharedModule,
    DatabaseModule,
    // MongooseModule.forFeature([
    //   { name: DiscussionModel.name, schema: DiscussionSchema },
    // ]),
  ],
  providers: [
    DiscussionMapper,
    DiscussionMongooseRepository,
    {
      provide: DiscussionRepository,
      useClass: DiscussionMongooseRepository,
    },
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
      useFactory: (discussionRepository: DiscussionRepository) =>
        new AddCommentUseCase(discussionRepository),
      inject: [DiscussionRepository],
    },
    {
      provide: DiscussionUseCases,
      inject: [
        CreateDiscussionUseCase,
        UpdateDiscussionUseCase,
        GetDiscussionByIdUseCase,
        AddCommentUseCase,
      ],
      useFactory: (
        createDiscussionUseCase: CreateDiscussionUseCase,
        updateDiscussionUseCase: UpdateDiscussionUseCase,
        getDiscussionByIdUseCase: GetDiscussionByIdUseCase,
        addCommentUseCase: AddCommentUseCase,
      ) =>
        new DiscussionUseCases(
          createDiscussionUseCase,
          updateDiscussionUseCase,
          getDiscussionByIdUseCase,
          addCommentUseCase,
        ),
    },
  ],
})
export class DiscussionModule {}
