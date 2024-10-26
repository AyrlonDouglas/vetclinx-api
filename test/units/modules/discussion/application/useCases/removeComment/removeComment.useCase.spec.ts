import { Right } from '@common/core/either';
import { InspetorError } from '@common/core/inspetor';
import { RemoveCommentErrors } from '@modules/discussion/application/useCases/removeComment/removeComment.errors';
import { DiscussionTestSetup } from '@modulesTest/discussion/test/DiscussionTest.setup';

describe('RemoveComment', () => {
  const makeSut = async () => {
    const {
      removeCommentUseCase,
      commentRepository,
      commentMock,
      contextStorageService,
      userMock,
      commentWithParentCommentMock,
    } = await new DiscussionTestSetup().prepare();

    const sut = removeCommentUseCase;

    return {
      sut,
      commentRepository,
      commentMock,
      contextStorageService,
      userMock,
      commentWithParentCommentMock,
    };
  };

  test('Should return left when input is not valid', async () => {
    const { sut } = await makeSut();

    const result = await sut.perform({ commentId: undefined });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InspetorError);
  });

  test('Should return left containing CommentNorFOundError when comment not found', async () => {
    const { sut } = await makeSut();

    const result = await sut.perform({ commentId: '98796598' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(
      RemoveCommentErrors.CommentNotFoundError,
    );
  });

  test('Should return left containing OnlyCreatoCanRemoveError when the user that trigger the remove comment do not is the creator', async () => {
    const { sut, commentMock, contextStorageService } = await makeSut();
    jest
      .spyOn(contextStorageService, 'get')
      .mockReturnValueOnce({ props: { id: '8987879' } });

    const result = await sut.perform({ commentId: commentMock.props.id });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(
      RemoveCommentErrors.OnlyCreatorCanRemoveError,
    );
  });

  test('should remove a comment successfully', async () => {
    const { sut, commentMock, contextStorageService, userMock } =
      await makeSut();
    jest.spyOn(contextStorageService, 'get').mockReturnValueOnce(userMock);

    const result = await sut.perform({ commentId: commentMock.props.id });

    expect(result.isRight()).toBe(true);
    expect(result).toBeInstanceOf(Right);

    if (result.isRight()) {
      expect(result.value).toEqual({
        count: 2,
        deleted: true,
        voteDeletedCount: 1,
      });
    }
  });

  test('should remove a comment successfully when has parent comment', async () => {
    const {
      sut,
      commentWithParentCommentMock,
      contextStorageService,
      userMock,
    } = await makeSut();
    jest.spyOn(contextStorageService, 'get').mockReturnValueOnce(userMock);
    const result = await sut.perform({
      commentId: commentWithParentCommentMock.props.id,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value).toEqual({
        count: 1,
        deleted: true,
        voteDeletedCount: 0,
      });
    }
  });
});
