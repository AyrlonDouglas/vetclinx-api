import { InspetorError } from '@common/core/inspetor';
import { UpdateCommentErrors } from '@modules/discussion/application/useCases/updateComment/updateComment.errors';
import { DiscussionTestSetup } from '@modulesTest/discussion/test/DiscussionTest.setup';

describe('UpdateComment', () => {
  const makeSut = async () => {
    const {
      updateCommentUseCase,
      discussionRepository,
      discusssionMock,
      contextStorageService,
      commentMock,
      userMock,
      commentRepository,
    } = await new DiscussionTestSetup().prepare();
    jest
      .spyOn(contextStorageService, 'get')
      .mockReturnValue({ props: { id: userMock.props.id } } as any);

    return {
      sut: updateCommentUseCase,
      discussionRepository,
      discusssionMock,
      contextStorageService,
      commentMock,
      userMock,
      commentRepository,
    };
  };

  test('Should return left containing InspetorError when input is invalid', async () => {
    const { sut } = await makeSut();

    const result = await sut.perform({
      commentId: null as string,
      content: null as string,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InspetorError);
  });

  test('Should return left containing CommentNotFoundError when comment not found', async () => {
    const { sut } = await makeSut();

    const result = await sut.perform({ commentId: '598598', content: 'teste' });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(
      UpdateCommentErrors.CommentNotFoundError,
    );
  });

  test('Should return left containing OnlyCreatorCanUpdateError when user is not creator', async () => {
    const { sut, contextStorageService, commentMock } = await makeSut();
    jest
      .spyOn(contextStorageService, 'get')
      .mockReturnValue({ props: { id: '123456789' } } as any);

    const result = await sut.perform({
      commentId: commentMock.props.id,
      content: 'teste',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(
      UpdateCommentErrors.OnlyCreatorCanUpdateError,
    );
  });

  test('Should return left when create new commentUpdated fails', async () => {
    const { sut, commentMock, commentRepository, userMock } = await makeSut();
    jest.spyOn(commentRepository, 'findById').mockReturnValue({
      props: { id: '', authorId: userMock.props.id },
    } as any);

    const result = await sut.perform({
      commentId: commentMock.props.id,
      content: 'teste',
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InspetorError);
  });

  test('Should return right containing commentId when update sucessful', async () => {
    const { sut, commentMock } = await makeSut();

    const result = await sut.perform({
      commentId: commentMock.props.id,
      content: 'comment updated',
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value).toEqual({ id: commentMock.props.id });
    }
  });
});
