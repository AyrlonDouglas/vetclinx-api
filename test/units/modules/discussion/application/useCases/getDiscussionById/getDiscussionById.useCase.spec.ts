import { InspetorError } from '@common/core/inspetor';
import { Discussion } from '@modules/discussion/domain/entities/discussion/discussion.entity';
import { DiscussionTestSetup } from '@modulesTest/discussion/test/DiscussionTest.setup';

describe('GetDiscussionByIdUseCase', () => {
  const makeSut = async () => {
    const { getDiscussionByIdUseCase, discusssionMock } =
      (await new DiscussionTestSetup().prepare()) as DiscussionTestSetup;

    const sut = getDiscussionByIdUseCase;

    return { sut, discusssionMock };
  };

  test('Should return discussion when found', async () => {
    const { discusssionMock, sut } = await makeSut();

    const result = await sut.perform({ id: discusssionMock.props.id });

    expect(result.isRight()).toBe(true);
    expect(result.value).toBeInstanceOf(Discussion);
    if (result.isRight()) {
      expect(result.value.props).toEqual(discusssionMock.props);
    }
  });

  test('Should return null when not found discussion', async () => {
    const { sut } = await makeSut();

    const result = await sut.perform({ id: '698' });
    expect(result.isRight()).toBe(true);
    expect(result.value).not.toBeInstanceOf(Discussion);
    expect(result.value).toBe(null);
  });

  test('Should get error when id is empty', async () => {
    const { sut } = await makeSut();
    const result = await sut.perform({ id: null });
    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InspetorError);
  });
});
