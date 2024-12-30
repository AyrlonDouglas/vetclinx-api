import { VoteTypes } from '@modules/discussion/domain/component/voteManager.component';
import { CommentVote } from '@modules/discussion/domain/entities/vote/commentVote.entity';

describe('CommentVote', () => {
  function makeSut() {
    const validInput = {
      authorId: '1',
      commentId: '1',
      voteType: VoteTypes.up,
    };
    const sut = CommentVote;

    return { sut, validInput };
  }

  describe.only('create', () => {
    test('Should return rigth containing commentVote when input is valid', () => {
      const { sut, validInput } = makeSut();

      const result = sut.create(validInput);

      expect(result.isRight()).toBe(true);
      expect(result.value).toBeInstanceOf(CommentVote);
    });
  });
});
