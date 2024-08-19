import { InspetorError } from '@common/core/inspetor';
import {
  Comment,
  CommentCreateInput,
} from '@modules/discussion/domain/entities/comment/comment.entity';

describe('Comment', () => {
  const makeSut = () => {
    const inputBase = {
      authorId: '123',
      content: 'content teste',
      CommentId: '321',
    };
    const sut = Comment;

    const commentCreateInput: CommentCreateInput = {
      authorId: '123',
      content: 'animal was sick',
      discussionId: '123123',
    };

    const commentMock = Comment.create(commentCreateInput);
    if (commentMock.isLeft()) {
      throw new Error('commentMock fail');
    }

    return { sut, inputBase, commentMock: commentMock.value };
  };

  describe('Comment.create()', () => {
    test('Should return left when input fail', () => {
      const { sut } = makeSut();

      const result1 = sut.create({
        authorId: '123123',
        content: 'content',
        discussionId: '',
      });
      const result2 = sut.create({
        authorId: '',
        content: 'content',
        discussionId: '123123',
      });
      const result3 = sut.create({
        authorId: '123123',
        content: '',
        discussionId: '123123',
      });

      expect(result1.isLeft()).toBe(true);
      expect(result1.value).toBeInstanceOf(InspetorError);
      expect(result2.isLeft()).toBe(true);
      expect(result1.value).toBeInstanceOf(InspetorError);
      expect(result3.isLeft()).toBe(true);
      expect(result1.value).toBeInstanceOf(InspetorError);
    });

    test('Should return right containing Comment instance when input success', () => {
      const { sut } = makeSut();

      const result = sut.create({
        authorId: '123123',
        content: 'content',
        discussionId: '32132',
      });

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeInstanceOf(Comment);
      if (result.isRight()) {
        expect(result.value.props.authorId).toEqual('123123');
        expect(result.value.props.content).toEqual('content');
        expect(result.value.props.discussionId).toEqual('32132');
        expect(result.value.props.upvotes).toEqual(0);
        expect(result.value.props.downvotes).toEqual(0);
        expect(result.value.props.createdAt).toBeInstanceOf(Date);
      }
    });
  });

  describe('Comment.upvote()', () => {
    test('Should add vote when call upvote', () => {
      const { commentMock: sut } = makeSut();

      const result = sut;
      expect(result.props.upvotes).toBe(0);

      result.upvote();
      expect(result.props.upvotes).toBe(1);
      result.upvote();
      result.upvote();
      result.upvote();
      result.upvote();
      expect(result.props.upvotes).toBe(5);
    });
  });

  describe('Comment.dowmvote()', () => {
    test('Should subtract vote when call downvote', () => {
      const { commentMock: sut } = makeSut();

      const result = sut;

      expect(result.props.downvotes).toBe(0);

      result.downvote();
      expect(result.props.downvotes).toBe(1);
      result.downvote();
      result.downvote();
      result.downvote();
      result.downvote();
      expect(result.props.downvotes).toBe(5);
    });
  });
});
