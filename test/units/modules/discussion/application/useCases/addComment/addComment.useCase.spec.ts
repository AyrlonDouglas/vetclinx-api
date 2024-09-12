import { left } from '@common/core/either';
import { InspetorError } from '@common/core/inspetor';
import AddCommentErrors from '@modules/discussion/application/useCases/addComment/addComment.errors';
import { Comment } from '@modules/discussion/domain/entities/comment/comment.entity';
import { DiscussionTestSetup } from '@modulesTest/discussion/test/DiscussionTest.setup';

describe('AddCommentUseCase', () => {
  const makeSut = async () => {
    const { addCommentUseCase, discussionRepository, discusssionMock } =
      (await new DiscussionTestSetup().prepare()) as DiscussionTestSetup;
    return {
      sut: addCommentUseCase,
      discussionRepository,
      discusssionMock,
    };
  };

  test('Should return InspectorError when input is invalid', async () => {
    const { sut, discusssionMock } = await makeSut();

    const result1 = await sut.perform({
      authorId: discusssionMock.props.authorId,
      content: 'content',
      discussionId: '',
    });
    const result2 = await sut.perform({
      authorId: discusssionMock.props.authorId,
      content: '',
      discussionId: discusssionMock.props.id,
    });
    const result3 = await sut.perform({
      authorId: '',
      content: 'content',
      discussionId: discusssionMock.props.id,
    });

    expect(result1.isLeft()).toBe(true);
    expect(result2.isLeft()).toBe(true);
    expect(result3.isLeft()).toBe(true);
    expect(result1.value).toBeInstanceOf(InspetorError);
    expect(result2.value).toBeInstanceOf(InspetorError);
    expect(result3.value).toBeInstanceOf(InspetorError);
  });

  test('Should return DiscussionNotFoundError when discussion dont exists', async () => {
    const { sut } = await makeSut();

    const result = await sut.perform({
      authorId: '1233213123asd',
      content: 'content',
      discussionId: '123asdas123123assd',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(
      AddCommentErrors.DiscussionNotFoundError,
    );
  });

  test('Should return InspetorError when create comment fails', async () => {
    const { sut, discusssionMock } = await makeSut();
    jest
      .spyOn(Comment, 'create')
      .mockReturnValueOnce(left(new InspetorError('')));

    const result = await sut.perform({
      authorId: '1233213123asd',
      content: 'content',
      discussionId: discusssionMock.props.id,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InspetorError);
  });

  test('Should return discussionId when comment was add in discussion', async () => {
    const { sut, discusssionMock, discussionRepository } = await makeSut();

    const result = await sut.perform({
      authorId: '123',
      content: 'content test',
      discussionId: discusssionMock.props.id,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value).toEqual({ id: discusssionMock.props.id });

      const discussion = await discussionRepository.findById(result.value.id);
      const comment = discussion.props.comments.find(
        (el) => el.props.authorId === '123',
      );
      expect(comment).toBeDefined();
      expect(comment.props.authorId).toEqual('123');
      expect(comment.props.content).toEqual('content test');
      expect(comment.props.discussionId).toEqual(discusssionMock.props.id);
      expect(comment.props.createdAt).toEqual(comment.props.updatedAt);
      expect(comment.props.downvotes).toEqual(0);
      expect(comment.props.upvotes).toEqual(0);
    }
  });
});
