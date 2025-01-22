import { InspetorError } from '@common/core/inspetor';
import { VoteTypes } from '@modules/discussion/domain/component/voteManager.component';
import { CommentVote } from '@modules/discussion/domain/entities/vote/commentVote.entity';

describe('CommentVote', () => {
  function makeSut() {
    const validInput = {
      authorId: '1',
      commentId: '1',
      voteType: VoteTypes.up,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: '1',
    };
    const sut = CommentVote;

    return { sut, validInput };
  }

  describe('CommentVote.create()', () => {
    test('Should return rigth containing commentVote when input is valid', () => {
      const { sut, validInput } = makeSut();

      const result = sut.create(validInput);

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeInstanceOf(CommentVote);
      expect((result.value as CommentVote).props).toEqual({
        authorId: validInput.authorId,
        voteType: VoteTypes.up,
        commentId: validInput.commentId,
        id: validInput.id,
        createdAt: validInput.createdAt,
        updatedAt: validInput.updatedAt,
      });
    });

    test('Should return left contaning InspectorError when input is invalid', () => {
      const { sut, validInput } = makeSut();

      const result = sut.create({
        authorId: '',
        commentId: validInput.commentId,
        voteType: validInput.voteType,
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(InspetorError);
    });

    test('Should return left containing InspectorError when voteType is invalid', () => {
      const { sut, validInput } = makeSut();

      const result = sut.create({
        ...validInput,
        voteType: 'invalidVote' as keyof typeof VoteTypes,
      });

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(InspetorError);
    });
  });

  describe('CommentVote.setVoteType()', () => {
    test('Should change voteType when voteType is valid', () => {
      const { sut, validInput } = makeSut();

      const result = sut.create(validInput).value as CommentVote;
      result.setVoteType(VoteTypes.down);

      expect(result.props.voteType).toEqual(VoteTypes.down);
    });

    test('Should not change voteType when voteType is invalid', () => {
      const { sut, validInput } = makeSut();

      const result = sut.create(validInput).value as CommentVote;
      result.setVoteType('invalid' as keyof typeof VoteTypes);

      expect(result.props.voteType).toEqual(VoteTypes.up);
    });

    test('Should not change voteType when voteType is equal', () => {
      const { sut, validInput } = makeSut();

      const result = sut.create(validInput).value as CommentVote;
      result.setVoteType(VoteTypes.up);

      expect(result.props.voteType).toEqual(VoteTypes.up);
    });
  });
});
