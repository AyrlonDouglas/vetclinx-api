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
import { MongooseModule } from '@nestjs/mongoose';
import { DiscussionModel, DiscussionSchema } from './schemas/discussion.schema';

@Module({
  controllers: [DiscussionController],
  imports: [
    SharedModule,
    MongooseModule.forFeature([
      { name: DiscussionModel.name, schema: DiscussionSchema },
    ]),
  ],
  providers: [
    DiscussionMapper, // { provide: DiscussionMapper, useFactory: () => new DiscussionMapper() },
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
      provide: DiscussionUseCases,
      inject: [
        CreateDiscussionUseCase,
        UpdateDiscussionUseCase,
        GetDiscussionByIdUseCase,
      ],
      useFactory: (
        createDiscussionUseCase: CreateDiscussionUseCase,
        updateDiscussionUseCase: UpdateDiscussionUseCase,
        getDiscussionByIdUseCase: GetDiscussionByIdUseCase,
      ) =>
        new DiscussionUseCases(
          createDiscussionUseCase,
          updateDiscussionUseCase,
          getDiscussionByIdUseCase,
        ),
    },
  ],
})
export class DiscussionModule {}
