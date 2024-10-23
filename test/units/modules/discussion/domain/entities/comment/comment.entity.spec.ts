import { InspetorError } from '@common/core/inspetor';
import {
  voteGradeScale,
  VoteTypes,
} from '@modules/discussion/domain/component/voteManager.component';
import {
  Comment,
  CommentCreateInput,
} from '@modules/discussion/domain/entities/comment/comment.entity';
import { Vote } from '@modules/discussion/domain/entities/vote/vote.entity';

describe('Comment', () => {
  const makeSut = () => {
    const inputBase = {
      author: '123',
      content: 'content teste',
      CommentId: '321',
    };
    const sut = Comment;

    const commentCreateInput: CommentCreateInput = {
      authorId: '123',
      content: 'animal was sick',
      discussionId: '123123',
      commentCount: 0,
      id: '369852147',
    };

    const commentMock = Comment.create(commentCreateInput);
    if (commentMock.isLeft()) {
      throw new Error('commentMock fail');
    }

    const commentUpVote = Vote.create({
      user: '123',
      voteFor: 'comment',
      voteForReferency: commentMock.value.props.id,
      voteType: VoteTypes.up,
      createdAt: new Date(),
      id: '123',
      updatedAt: new Date(),
    }).value as Vote;

    const commentDownVote = Vote.create({
      user: '123',
      voteFor: 'comment',
      voteForReferency: commentMock.value.props.id,
      voteType: VoteTypes.down,
      createdAt: new Date(),
      id: '123',
      updatedAt: new Date(),
    }).value as Vote;

    return {
      sut,
      inputBase,
      commentMock: commentMock.value,
      commentUpVote,
      commentDownVote,
    };
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

  describe('Comment.getGradeVote()', () => {
    test('Should return gradeVote', () => {
      const { commentMock: sut } = makeSut();

      const result = sut.getVoteGrade();

      expect(result).toEqual(voteGradeScale.neutral);
    });
  });

  describe('Comment.editComment()', () => {
    test('should edit the content of the comment', () => {
      const { commentMock: sut } = makeSut();

      sut.editComment('New content for the comment');

      expect(sut.props.content).toBe('New content for the comment');
    });
  });

  describe('Comment.incrementCommentCount()', () => {
    test('Should increment the comment count by 1', () => {
      const { commentMock: sut } = makeSut();

      sut.incrementCommentCount();
      expect(sut.props.commentCount).toBe(1);
    });
  });

  describe('Comment.decrementCommentCount()', () => {
    test('should decrement the comment count by 1 but not below 0', () => {
      const { commentMock: sut } = makeSut();

      sut.incrementCommentCount(); // Increment first so we have something to decrement
      sut.decrementCommentCount();
      expect(sut.props.commentCount).toBe(0); // Back to 0

      sut.decrementCommentCount(); // Try to decrement again (should stay at 0)
      expect(sut.props.commentCount).toBe(0);
    });
  });

  describe('Comment.removeVote()', () => {
    test('should remove an upvote', () => {
      const { commentMock: sut, commentUpVote } = makeSut();
      sut.upvote();

      sut.removeVote(commentUpVote);

      expect(sut.props.upvotes).toBe(0);
    });

    test('should remove a downvote', () => {
      const { commentMock: sut, commentDownVote } = makeSut();
      sut.downvote();

      sut.removeVote(commentDownVote);
      expect(sut.props.downvotes).toBe(0);
    });
  });

  describe('Comment.exchangeVote()', () => {
    test('should exchange an upvote for a downvote', () => {
      const { commentMock: sut } = makeSut();
      sut.upvote();
      sut.upvote();
      sut.upvote();
      sut.upvote();
      sut.upvote();
      sut.downvote();
      sut.downvote();
      sut.downvote();

      sut.exchangeVote(VoteTypes.up, VoteTypes.down);

      expect(sut.props.upvotes).toBe(4); // Decrement upvotes
      expect(sut.props.downvotes).toBe(4); // Increment downvotes
    });

    test('should exchange a downvote for an upvote', () => {
      const { commentMock: sut } = makeSut();
      sut.upvote();
      sut.upvote();
      sut.upvote();
      sut.upvote();
      sut.upvote();
      sut.downvote();
      sut.downvote();
      sut.downvote();

      sut.exchangeVote(VoteTypes.down, VoteTypes.up);

      expect(sut.props.upvotes).toBe(6); // Increment upvotes
      expect(sut.props.downvotes).toBe(2); // Decrement downvotes
    });

    test('should not change votes if the vote type remains the same (up to up)', () => {
      const { commentMock: sut } = makeSut();
      sut.upvote();
      sut.upvote();
      sut.upvote();
      sut.upvote();
      sut.upvote();
      sut.downvote();
      sut.downvote();
      sut.downvote();

      sut.exchangeVote(VoteTypes.up, VoteTypes.up);

      expect(sut.props.upvotes).toBe(5); // No change
      expect(sut.props.downvotes).toBe(3); // No change
    });

    test('should not change votes if the vote type remains the same (down to down)', () => {
      const { commentMock: sut } = makeSut();
      sut.upvote();
      sut.upvote();
      sut.upvote();
      sut.upvote();
      sut.upvote();
      sut.downvote();
      sut.downvote();
      sut.downvote();

      sut.exchangeVote(VoteTypes.down, VoteTypes.down);

      expect(sut.props.upvotes).toBe(5); // No change
      expect(sut.props.downvotes).toBe(3); // No change
    });
  });
});
