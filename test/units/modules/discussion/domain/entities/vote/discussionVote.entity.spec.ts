import { InspetorError } from '@common/core/inspetor';
import { VoteTypes } from '@modules/discussion/domain/component/voteManager.component';
import { DiscussionVote } from '@modules/discussion/domain/entities/vote/discussionVote.entity';

describe('DiscussionVote', () => {
  function makeSut() {
    const validInput = {
      authorId: '1',
      discussionId: '1',
      voteType: VoteTypes.up,
      createdAt: new Date(),
      id: '1',
      updatedAt: new Date(),
    };
    const sut = DiscussionVote;

    return { sut, validInput };
  }

  describe('DiscussionVote.create()', () => {
    test('Should return right containing DiscussionVote', () => {
      const { sut, validInput } = makeSut();

      const result = sut.create(validInput);

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeInstanceOf(DiscussionVote);
      expect((result.value as DiscussionVote).props).toEqual(validInput);
    });

    test('Should return left contaning InspectorError when input is invalid', () => {
      const { sut, validInput } = makeSut();

      const result = sut.create({
        authorId: '',
        discussionId: validInput.discussionId,
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

  describe('DiscussionVote.setVoteType()', () => {
    test('Should change voteType when voteType is valid', () => {
      const { sut, validInput } = makeSut();

      const result = sut.create(validInput).value as DiscussionVote;
      result.setVoteType(VoteTypes.down);

      expect(result.props.voteType).toEqual(VoteTypes.down);
    });

    test('Should not change voteType when voteType is invalid', () => {
      const { sut, validInput } = makeSut();

      const result = sut.create(validInput).value as DiscussionVote;
      result.setVoteType('invalid' as keyof typeof VoteTypes);

      expect(result.props.voteType).toEqual(VoteTypes.up);
    });

    test('Should not change voteType when voteType is equal', () => {
      const { sut, validInput } = makeSut();

      const result = sut.create(validInput).value as DiscussionVote;
      result.setVoteType(VoteTypes.up);

      expect(result.props.voteType).toEqual(VoteTypes.up);
    });
  });
});
