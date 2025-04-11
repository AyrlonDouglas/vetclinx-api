import { left } from '@common/core/either';
import { InspectorError } from '@common/core/inspector';
import AddCommentErrors from '@modules/discussion/application/useCases/addComment/addComment.errors';
import DiscussionErrors from '@modules/discussion/application/useCases/discussion.errors';
import { Comment } from '@modules/discussion/domain/entities/comment/comment.entity';
import { DiscussionTestSetup } from '@modulesTest/discussion/test/DiscussionTest.setup';

describe('AddCommentUseCase', () => {
  const makeSut = async () => {
    const {
      addCommentUseCase,
      discussionRepository,
      discusssionMock,
      contextStorageService,
      commentMock,
    } = (await new DiscussionTestSetup().prepare()) as DiscussionTestSetup;

    jest
      .spyOn(contextStorageService, 'get')
      .mockReturnValue({ props: { id: '123' } } as any);

    return {
      sut: addCommentUseCase,
      discussionRepository,
      discusssionMock,
      contextStorageService,
      commentMock,
    };
  };

  test('Should return InspectorError when input is invalid', async () => {
    const { sut, discusssionMock } = await makeSut();

    const result1 = await sut.perform({
      content: 'content',
      discussionId: '',
    });
    const result2 = await sut.perform({
      content: '',
      discussionId: discusssionMock.props.id,
    });

    expect(result1.isLeft()).toBe(true);
    expect(result2.isLeft()).toBe(true);
    expect(result1.value).toBeInstanceOf(InspectorError);
    expect(result2.value).toBeInstanceOf(InspectorError);
  });

  test('Should return DiscussionNotFoundError when discussion dont exists', async () => {
    const { sut } = await makeSut();

    const result = await sut.perform({
      content: 'content',
      discussionId: '123asdas123123assd',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(
      DiscussionErrors.DiscussionNotFoundError,
    );
  });

  test('Should return InspectorError when create comment fails', async () => {
    const { sut, discusssionMock } = await makeSut();

    jest
      .spyOn(Comment, 'create')
      .mockReturnValueOnce(left(new InspectorError('')));

    const result = await sut.perform({
      content: 'content',
      discussionId: discusssionMock.props.id,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InspectorError);
  });

  test('Should return new comment id when comment was add in discussion', async () => {
    const { sut, discusssionMock } = await makeSut();

    const result = await sut.perform({
      content: 'content test',
      discussionId: discusssionMock.props.id,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value).toBeDefined();
    }
  });

  test('SHould return left containing ParentCommentNorFOundError when parentComment not found', async () => {
    const { sut, discusssionMock } = await makeSut();

    const result = await sut.perform({
      content: 'some comment',
      discussionId: discusssionMock.props.id,
      parentCommentId: '9878987987',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(
      AddCommentErrors.ParentCommentNotFoundError,
    );
  });

  test('Shoul return new comment id when comment was add in discussion and have parent comment', async () => {
    const { sut, discusssionMock, commentMock } = await makeSut();

    const result = await sut.perform({
      content: 'some comment',
      discussionId: discusssionMock.props.id,
      parentCommentId: commentMock.props.id,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value).toBeDefined();
    }
  });
});
