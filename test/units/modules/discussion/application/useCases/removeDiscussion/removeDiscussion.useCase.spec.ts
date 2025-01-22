import { InspetorError } from '@common/core/inspetor';
import DiscussionErrors from '@modules/discussion/application/useCases/discussion.errors';
import { RemoveDiscussionErrors } from '@modules/discussion/application/useCases/removeDiscussion/removeDiscussion.errors';
import { DiscussionTestSetup } from '@modulesTest/discussion/test/DiscussionTest.setup';

describe('RemoveDiscussion', () => {
  const makeSut = async () => {
    const { removeDiscussionUseCase, discusssionMock, contextStorageService } =
      await new DiscussionTestSetup().prepare();

    jest.spyOn(contextStorageService, 'get').mockReturnValue({
      props: { id: discusssionMock.props.authorId },
    } as any);

    return {
      sut: removeDiscussionUseCase,
      discusssionMock,
      contextStorageService,
    };
  };

  test('Should return left containing InspetorError when input is invalid', async () => {
    const { sut } = await makeSut();

    const result = await sut.perform({ discussionId: '' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InspetorError);
  });

  test('Should return left containing DiscussionNotFoundError when the discussion not found', async () => {
    const { sut } = await makeSut();

    const result = await sut.perform({ discussionId: '984654623132132132' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(
      DiscussionErrors.DiscussionNotFoundError,
    );
  });

  test('Should return left containing OnlyCreatorCanDeleteError when the user is not the creator', async () => {
    const { sut, discusssionMock, contextStorageService } = await makeSut();
    jest
      .spyOn(contextStorageService, 'get')
      .mockReturnValue({ props: '1212121212' } as any);

    const result = await sut.perform({
      discussionId: discusssionMock.props.id,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(
      RemoveDiscussionErrors.OnlyCreatorCanDeleteError,
    );
  });

  test('Should return right when remove discussion is successful', async () => {
    const { sut, discusssionMock } = await makeSut();
    const result = await sut.perform({
      discussionId: discusssionMock.props.id,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value).toEqual({
        deleted: true,
        commentDeletedCount: 2,
        commentVotesDeleteds: 1,
        discussionVotesDeleteds: 0,
      });
    }
  });
});
