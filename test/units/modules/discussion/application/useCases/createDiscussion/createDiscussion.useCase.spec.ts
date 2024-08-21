import { InspetorError } from '@common/core/inspetor';
import { CreateDiscussionUseCase } from '@modules/discussion/application/useCases/createDiscussion/createDiscussion.useCase';
import { DiscussionFakeRepository } from '@modules/discussion/infra/repositories/discussionFakeRepository';
import {
  ContextStorageService,
  Context,
} from '@modules/shared/domain/contextStorage.service';
import { AsyncLocalStorage } from 'async_hooks';

describe('CreateDiscussionUseCase', () => {
  const makeSut = () => {
    const contextStorageService = new ContextStorageService(
      {} as AsyncLocalStorage<Context>,
    );

    const discussionRepository = new DiscussionFakeRepository([]);
    const sut = new CreateDiscussionUseCase(
      contextStorageService,
      discussionRepository,
    );

    return { sut, discussionRepository, contextStorageService };
  };

  test('should return InspectorError when CreateDiscussionUseCaseDTO was invalid', async () => {
    const { sut, contextStorageService } = makeSut();
    jest
      .spyOn(contextStorageService, 'get')
      .mockReturnValueOnce({ props: { id: '123' } } as any);

    const result = await sut.perform({ description: '', title: '' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InspetorError);
  });

  test('should return new discussion`s id when CreateDiscussionUseCaseDTO was valid', async () => {
    const { sut, contextStorageService } = makeSut();
    jest
      .spyOn(contextStorageService, 'get')
      .mockReturnValueOnce({ props: { id: '123' } } as any);

    const result = await sut.perform({
      description: 'valid description',
      title: 'valid title',
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.id).toBeDefined();
    }
  });
});
