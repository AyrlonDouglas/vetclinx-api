import { voteGradeScale } from '@modules/discussion/domain/component/voteManager.component';
import {
  Comment,
  CommentCreateInput,
} from '@modules/discussion/domain/entities/comment/comment.entity';
import {
  Discussion,
  DiscussionCreateInput,
} from '@modules/discussion/domain/entities/discussion/discussion.entity';

describe('Discussion', () => {
  const makeSut = () => {
    const discussionCreateInput: DiscussionCreateInput = {
      authorId: '123',
      description: 'animal was sick',
      title: 'Ineed help to resolvethis case',
    };

    const discussionMock = Discussion.create(discussionCreateInput);
    if (discussionMock.isLeft()) {
      throw new Error('discussionMock fail');
    }

    const commentCreateInput: CommentCreateInput = {
      authorId: '123',
      content: 'animal was sick',
      discussionId: '123123',
    };

    const commentMock = Comment.create(commentCreateInput);
    if (commentMock.isLeft()) {
      throw new Error('commentMock fail');
    }

    const sut = Discussion;

    return {
      sut,
      discussionCreateInput,
      discussionMock: discussionMock.value,
      commentMock: commentMock.value,
    };
  };

  describe('Discussion.create()', () => {
    test('Shoul return left when input fail', () => {
      const { sut } = makeSut();

      const result1 = sut.create({
        authorId: 'somethingg',
        description: 'something',
        title: '',
      });
      const result2 = sut.create({
        authorId: 'somethingg',
        description: '',
        title: 'somethingg',
      });
      const result3 = sut.create({
        authorId: '',
        description: 'somethingg',
        title: 'somethingg',
      });

      expect(result1.isLeft()).toBe(true);
      expect(result1.value);
      expect(result2.isLeft()).toBe(true);
      expect(result2.value);
      expect(result3.isLeft()).toBe(true);
      expect(result3.value);
    });

    test('Should return rigth containing Discussion instance when min input success', () => {
      const { sut, discussionCreateInput } = makeSut();

      const result = sut.create(discussionCreateInput);

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeInstanceOf(Discussion);
      if (result.isRight()) {
        expect(result.value.props.authorId).toEqual(
          discussionCreateInput.authorId,
        );
        expect(result.value.props.description).toEqual(
          discussionCreateInput.description,
        );
        expect(result.value.props.title).toEqual(discussionCreateInput.title);
        expect(result.value.props.createdAt).toBeInstanceOf(Date);
        expect(result.value.props.upvotes).toBe(0);
        expect(result.value.props.downvotes).toBe(0);
      }
    });
  });

  describe('Discussion.upvote()', () => {
    test('Should add vote when call upvote', () => {
      const { discussionMock: sut } = makeSut();

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

  describe('Discussion.dowmvote()', () => {
    test('Should subtract vote when call downvote', () => {
      const { discussionMock: sut } = makeSut();

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

  describe('Discussion.incrementCommentCount()', () => {
    test('Should add comments when call addComment', () => {
      const { discussionMock: sut } = makeSut();

      const result = sut;
      expect(result.props.commentCount).toStrictEqual(0);

      sut.incrementCommentCount();
      expect(result.props.commentCount).toEqual(1);

      sut.incrementCommentCount();
      expect(result.props.commentCount).toEqual(2);
    });
  });

  describe('Discussion.getGradeVote()', () => {
    test('Should return gradeVote', () => {
      const { discussionMock: sut } = makeSut();

      const result = sut.getVoteGrade();

      expect(result).toEqual(voteGradeScale.neutral);
    });
  });
});
