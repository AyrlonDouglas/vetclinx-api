import { InspetorError } from '@common/core/inspetor';
import { DiscussionTestSetup } from '@modulesTest/discussion/test/DiscussionTest.setup';

describe('CreateDiscussionUseCase', () => {
  const makeSut = async () => {
    const {
      createDiscussionUseCase,
      discussionRepository,
      contextStorageService,
    } = (await new DiscussionTestSetup().prepare()) as DiscussionTestSetup;
    return {
      sut: createDiscussionUseCase,
      discussionRepository,
      contextStorageService,
    };
  };

  test('should return InspectorError when CreateDiscussionUseCaseDTO was invalid', async () => {
    const { sut, contextStorageService } = await makeSut();
    jest
      .spyOn(contextStorageService, 'get')
      .mockReturnValueOnce({ props: { id: '123' } } as any);

    const result = await sut.perform({ description: '', title: '' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InspetorError);
  });

  test('should return new discussion`s id when CreateDiscussionUseCaseDTO was valid', async () => {
    const { sut, contextStorageService } = await makeSut();
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
