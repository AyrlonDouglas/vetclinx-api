import { left } from '@common/core/either';
import { InspectorError } from '@common/core/inspector';
import { VoteOnCommentError } from '@modules/discussion/application/useCases/voteOnComment/voteOnComment.errors';
import { VoteTypes } from '@modules/discussion/domain/component/voteManager.component';
import { CommentVote } from '@modules/discussion/domain/entities/vote/commentVote.entity';
import { DiscussionTestSetup } from '@modulesTest/discussion/test/DiscussionTest.setup';

describe('VoteOnComment', () => {
  const makeSut = async () => {
    const {
      voteOnCommentUseCase,
      contextStorageService,
      userMock,
      userMock2,
      commentMock,
      commentVoteRepository,
    } = await new DiscussionTestSetup().prepare();

    jest
      .spyOn(contextStorageService, 'get')
      .mockReturnValue({ props: { id: userMock2.props.id } } as any);

    return {
      sut: voteOnCommentUseCase,
      contextStorageService,
      userMock,
      userMock2,
      commentMock,
      commentVoteRepository,
    };
  };

  test('Should return left containig InspetorErroe when input is invalid', async () => {
    const { sut } = await makeSut();

    const result1 = await sut.perform({
      commentId: '123123',
      voteType: 'other' as any,
    });

    const result2 = await sut.perform({
      commentId: null,
      voteType: 'other' as any,
    });

    expect(result1.isLeft()).toBe(true);
    expect(result1.value).toBeInstanceOf(InspectorError);
    expect(result2.isLeft()).toBe(true);
    expect(result2.value).toBeInstanceOf(InspectorError);
  });

  test('Should return left containing CommentNotFoundError when the comment is not found', async () => {
    const { sut } = await makeSut();

    const result = await sut.perform({ commentId: '89798', voteType: 'down' });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(
      VoteOnCommentError.CommentNotFoundError,
    );
  });

  test('Should return left containing CreatorCannotVoteYourComment when the author vote is the creator of comment', async () => {
    const { sut, commentMock, contextStorageService, userMock } =
      await makeSut();
    jest
      .spyOn(contextStorageService, 'get')
      .mockReturnValue({ props: { id: userMock.props.id } } as any);

    const result = await sut.perform({
      commentId: commentMock.props.id,
      voteType: 'down',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(
      VoteOnCommentError.CreatorCannotVoteYourComment,
    );
  });

  test('Should remove vote when vote already exists and voteType is equal input', async () => {
    const { sut, commentMock, commentVoteRepository } = await makeSut();

    const result = await sut.perform({
      commentId: commentMock.props.id,
      voteType: VoteTypes.up,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ id: commentMock.props.id });
    expect(commentMock.props.upvotes).toBe(0);
    expect(commentMock.props.downvotes).toBe(0);
    expect(
      await commentVoteRepository.findOneByFilter({
        commentId: commentMock.props.id,
      }),
    ).toBe(undefined);
  });

  test('Should exchange vote when vote already exists and voteType is difference input', async () => {
    const { sut, commentMock, commentVoteRepository } = await makeSut();

    const result = await sut.perform({
      commentId: commentMock.props.id,
      voteType: VoteTypes.down,
    });

    expect(result.isRight()).toBe(true);
    expect(commentMock.props.downvotes).toBe(1);
    expect(commentMock.props.upvotes).toBe(0);
    expect(result.value).toEqual({ id: commentMock.props.id });
    expect(
      await commentVoteRepository.findOneByFilter({
        commentId: commentMock.props.id,
      }),
    ).toBeDefined();
  });

  test('Should return left when crete vote fails', async () => {
    const { sut, commentMock, commentVoteRepository } = await makeSut();
    jest
      .spyOn(commentVoteRepository, 'findOneByFilter')
      .mockReturnValueOnce(undefined);
    jest
      .spyOn(CommentVote, 'create')
      .mockReturnValueOnce(left(new InspectorError('some error')));

    const result = await sut.perform({
      commentId: commentMock.props.id,
      voteType: VoteTypes.up,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(InspectorError);
  });

  test('Should create upvote when vote not exists', async () => {
    const { sut, commentMock, commentVoteRepository } = await makeSut();
    jest
      .spyOn(commentVoteRepository, 'findOneByFilter')
      .mockReturnValue(undefined);

    const result = await sut.perform({
      commentId: commentMock.props.id,
      voteType: VoteTypes.up,
    });

    expect(result.isRight()).toBe(true);
    expect(commentMock.props.upvotes).toBe(2);
    expect(commentMock.props.downvotes).toBe(0);
    expect(result.value).toEqual({ id: commentMock.props.id });
  });

  test('Should create downvote when vote not exists', async () => {
    const { sut, commentMock, commentVoteRepository } = await makeSut();
    jest
      .spyOn(commentVoteRepository, 'findOneByFilter')
      .mockReturnValue(undefined);

    const result = await sut.perform({
      commentId: commentMock.props.id,
      voteType: VoteTypes.down,
    });

    expect(result.isRight()).toBe(true);
    expect(commentMock.props.upvotes).toBe(1);
    expect(commentMock.props.downvotes).toBe(1);
    expect(result.value).toEqual({ id: commentMock.props.id });
  });
});
