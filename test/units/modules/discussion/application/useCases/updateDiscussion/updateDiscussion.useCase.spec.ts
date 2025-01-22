import { left } from '@common/core/either';
import { InspetorError } from '@common/core/inspetor';
import UpdateDiscussionErrors from '@modules/discussion/application/useCases/updateDiscussion/updateDiscussion.errors';
import { Discussion } from '@modules/discussion/domain/entities/discussion/discussion.entity';
import { DiscussionTestSetup } from '@modulesTest/discussion/test/DiscussionTest.setup';

describe('UpdateDiscussionUseCase', () => {
  const makeSut = async () => {
    const {
      updateDiscussionUseCase,
      discussionRepository,
      contextStorageService,
      userMock,
      discusssionMock,
    } = (await new DiscussionTestSetup().prepare()) as DiscussionTestSetup;

    return {
      sut: updateDiscussionUseCase,
      discussionRepository,
      contextStorageService,
      discusssionMock,
      userMock,
    };
  };

  test('Should return left containing InspetorError when request fail', async () => {
    const { sut, contextStorageService, userMock, discusssionMock } =
      await makeSut();
    jest.spyOn(contextStorageService, 'get').mockReturnValueOnce(userMock);

    const result1 = await sut.perform({
      id: discusssionMock.props.id,
    });
    const result2 = await sut.perform({
      id: null,
      resolution: 'resolution to update',
    });

    expect(result1.isLeft()).toBe(true);
    expect(result2.isLeft()).toBe(true);
    expect(result1.value).toBeInstanceOf(InspetorError);
    expect(result2.value).toBeInstanceOf(InspetorError);
  });

  test('Should return left containing DiscussionNotFoundError when discussion dont exists', async () => {
    const { sut, contextStorageService, userMock } = await makeSut();
    jest.spyOn(contextStorageService, 'get').mockReturnValueOnce(userMock);

    const result = await sut.perform({
      description: 'alterando descricao',
      id: 'notexists',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(
      UpdateDiscussionErrors.DiscussionNotFoundError,
    );
  });

  test('Should return left containing OnlyCreatorCanUpdateError when userId is different than creator', async () => {
    const { sut, discusssionMock, contextStorageService } = await makeSut();
    jest
      .spyOn(contextStorageService, 'get')
      .mockReturnValueOnce({ props: { id: 'idoioioas' } } as any);

    const result = await sut.perform({
      description: 'alterando descricao',
      id: discusssionMock.props.id,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(
      UpdateDiscussionErrors.OnlyCreatorCanUpdateError,
    );
  });

  test('Should return left when Discussion.create fail', async () => {
    const { sut, discusssionMock, contextStorageService, userMock } =
      await makeSut();
    jest.spyOn(contextStorageService, 'get').mockReturnValueOnce(userMock);

    jest
      .spyOn(Discussion, 'create')
      .mockReturnValueOnce(left(new InspetorError('')));

    const result = await sut.perform({
      id: discusssionMock.props.id,
      description: 'teste',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InspetorError);
  });

  test('Should return rigth containing discussion id when update', async () => {
    const { sut, discusssionMock, contextStorageService, userMock } =
      await makeSut();
    jest.spyOn(contextStorageService, 'get').mockReturnValueOnce(userMock);

    const result = await sut.perform({
      id: discusssionMock.props.id,
      title: 'new title',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ id: discusssionMock.props.id });
  });
});
