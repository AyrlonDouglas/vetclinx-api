import {
  VoteFor,
  voteGradeScale,
  VoteTypes,
} from '@modules/discussion/domain/component/voteManager.component';
import {
  Comment,
  CommentCreateInput,
} from '@modules/discussion/domain/entities/comment/comment.entity';
import {
  Discussion,
  DiscussionCreateInput,
} from '@modules/discussion/domain/entities/discussion/discussion.entity';
import { Vote } from '@modules/discussion/domain/entities/vote/vote.entity';

describe('Discussion', () => {
  const makeSut = () => {
    const discussionCreateInput: DiscussionCreateInput = {
      authorId: '123',
      description: 'animal was sick',
      title: 'Ineed help to resolvethis case',
      id: '36985',
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

    const discussionUpVote = Vote.create({
      user: '123',
      voteFor: VoteFor.discussion,
      voteForReferency: discussionMock.value.props.id,
      voteType: VoteTypes.up,
    }).value as Vote;
    const discussionDownVote = Vote.create({
      user: '123',
      voteFor: VoteFor.discussion,
      voteForReferency: discussionMock.value.props.id,
      voteType: VoteTypes.down,
    }).value as Vote;

    const sut = Discussion;

    return {
      sut,
      discussionCreateInput,
      discussionMock: discussionMock.value,
      commentMock: commentMock.value,
      discussionUpVote,
      discussionDownVote,
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

  describe('Discussion.decrementCommentCount', () => {
    test('should decrement the comment count by 1 but not below 0', () => {
      const { discussionMock: sut } = makeSut();
      sut.incrementCommentCount();
      sut.incrementCommentCount();

      sut.decrementCommentCount();
      expect(sut.props.commentCount).toBe(1); // Decrementing from 2 to 1

      sut.decrementCommentCount(); // Decrement again
      expect(sut.props.commentCount).toBe(0); // Now should be 0

      sut.decrementCommentCount(); // Try to decrement below 0
      expect(sut.props.commentCount).toBe(0); // Should still be 0
    });
  });

  describe('Discussion.removeVote', () => {
    test('should remove an upvote', () => {
      const { discussionMock: sut, discussionUpVote } = makeSut();
      sut.upvote();
      sut.upvote();
      sut.downvote();

      sut.removeVote(discussionUpVote);

      expect(sut.props.upvotes).toBe(1);
      expect(sut.props.downvotes).toBe(1);
    });

    test('should remove a downvote', () => {
      const { discussionMock: sut, discussionDownVote } = makeSut();
      sut.upvote();
      sut.downvote();
      sut.downvote();

      sut.removeVote(discussionDownVote);

      expect(sut.props.upvotes).toBe(1);
      expect(sut.props.downvotes).toBe(1);
    });
  });

  describe('exchangeVote', () => {
    test('should exchange an upvote for a downvote', () => {
      const { discussionMock: sut } = makeSut();
      sut.upvote();
      sut.upvote();
      sut.upvote();
      sut.upvote();
      sut.upvote();
      sut.downvote();
      sut.downvote();
      sut.downvote();

      sut.exchangeVote(VoteTypes.up, VoteTypes.down);

      expect(sut.props.upvotes).toBe(4); // Upvotes should decrease
      expect(sut.props.downvotes).toBe(4); // Downvotes should increase
    });

    test('should exchange a downvote for an upvote', () => {
      const { discussionMock: sut } = makeSut();
      sut.upvote();
      sut.upvote();
      sut.upvote();
      sut.upvote();
      sut.upvote();
      sut.downvote();
      sut.downvote();
      sut.downvote();

      sut.exchangeVote(VoteTypes.down, VoteTypes.up);
      expect(sut.props.upvotes).toBe(6); // Upvotes should increase
      expect(sut.props.downvotes).toBe(2); // Downvotes should decrease
    });

    test('should not change votes if the vote type remains the same (up to up)', () => {
      const { discussionMock: sut } = makeSut();
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
      const { discussionMock: sut } = makeSut();
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
