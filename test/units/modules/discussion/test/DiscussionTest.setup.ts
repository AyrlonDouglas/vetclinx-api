import { DiscussionRepository } from '@modules/discussion/application/repositories/discussion.repository';
import { CreateDiscussionUseCase } from '@modules/discussion/application/useCases/createDiscussion/createDiscussion.useCase';
import { UpdateDiscussionUseCase } from '@modules/discussion/application/useCases/updateDiscussion/updateDiscussion.useCase';
import { Discussion } from '@modules/discussion/domain/entities/discussion/discussion.entity';
import { DiscussionFakeRepository } from '@modules/discussion/infra/repositories/discussionFakeRepository';
import {
  Context,
  ContextKeysProps,
  ContextStorageService,
} from '@modules/shared/domain/contextStorage.service';
import User from '@modules/user/domain/entities/user.entity';
import { UserTestSetup } from '@modulesTest/user/test/userTest.setup';
import { AsyncLocalStorage } from 'async_hooks';
import { randomUUID } from 'crypto';

export class DiscussionTestSetup {
  asyncLocalStorage: AsyncLocalStorage<Context>;
  createDiscussionUseCase: CreateDiscussionUseCase;
  discussionRepository: DiscussionRepository;
  contextStorageService: ContextStorageService;
  userMock: User;
  updateDiscussionUseCase: UpdateDiscussionUseCase;
  discusssionMock: Discussion;

  constructor() {}

  async prepare() {
    const { userMock } = new UserTestSetup().prepare();
    this.userMock = userMock;

    const store = new Map<
      keyof ContextKeysProps,
      ContextKeysProps[keyof ContextKeysProps]
    >();

    store.set('currentUser', userMock);

    const discusssionMock = Discussion.create({
      description: 'description teste',
      title: 'title test',
      authorId: userMock.props.id,
      id: randomUUID(),
    });

    if (discusssionMock.isLeft()) {
      throw new Error('discusssionMock fail');
    }
    this.discusssionMock = discusssionMock.value;

    this.discussionRepository = new DiscussionFakeRepository([
      discusssionMock.value,
    ]);

    this.asyncLocalStorage = {} as AsyncLocalStorage<Context>;
    this.contextStorageService = new ContextStorageService(
      this.asyncLocalStorage,
    );

    this.createDiscussionUseCase = new CreateDiscussionUseCase(
      this.contextStorageService,
      this.discussionRepository,
    );

    this.updateDiscussionUseCase = new UpdateDiscussionUseCase(
      this.contextStorageService,
      this.discussionRepository,
    );

    return this;
  }
}
