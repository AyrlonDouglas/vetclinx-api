import {
  voteGradeScale,
  VoteManager,
  VoteTypes,
} from '@modules/discussion/domain/component/voteManager.component';

describe('VoteManager', () => {
  describe('VoteManager.balance', () => {
    test('SHould return 0 when upvotes and downvotes is 0', () => {
      const sut = new VoteManager();

      const result = sut.balance;

      expect(result).toEqual(0);
    });

    test('SHould return the value correct when upvotes and downvotes is apply', () => {
      const sut = new VoteManager(1, 2);

      expect(sut.balance).toEqual(-1);

      sut.upvote();
      sut.upvote();
      expect(sut.balance).toEqual(1);

      sut.downvote();
      sut.upvote();
      expect(sut.balance).toEqual(1);

      sut.upvote();
      sut.upvote();
      expect(sut.balance).toEqual(3);
    });

    test('Should return 0 when the sum of upvote and downvotes be 0', () => {
      const sut = new VoteManager(123, 123);

      const result = sut.balance;

      expect(result).toEqual(0);
    });
  });

  describe('VoteManager.totalVotes', () => {
    test('Should init with zero votes when not passed nothing by constructor', () => {
      const sut = new VoteManager();

      const result = sut.totalVotes;

      expect(result).toEqual(0);
    });

    test('Should calculate correct when passed votes by constructor', () => {
      const sut = new VoteManager(1000, 200);

      const result = sut.totalVotes;

      expect(result).toEqual(1200);
    });
  });

  describe('VoteManager.grade', () => {
    test('Should return voteGradeScale.neutral', () => {
      const sut1 = new VoteManager(1000, 1000);
      const sut2 = new VoteManager(0, 1);
      const sut3 = new VoteManager(50, 60);

      const result1 = sut1.grade;
      const result2 = sut2.grade;
      const result3 = sut3.grade;

      expect(result1).toEqual(voteGradeScale.neutral);
      expect(result2).toEqual(voteGradeScale.neutral);
      expect(result3).toEqual(voteGradeScale.neutral);
    });

    test('Should return voteGradeScale.negative ', () => {
      const sut1 = new VoteManager(20, 80);
      const sut2 = new VoteManager(1000, 1700);
      const sut3 = new VoteManager(1, 10);

      const result1 = sut1.grade;
      const result2 = sut2.grade;
      const result3 = sut3.grade;

      expect(result1).toEqual(voteGradeScale.negative);
      expect(result2).toEqual(voteGradeScale.negative);
      expect(result3).toEqual(voteGradeScale.negative);
    });

    test('Should return voteGradeScale.positive ', () => {
      const sut1 = new VoteManager(80, 20);
      const sut2 = new VoteManager(30, 9);
      const sut3 = new VoteManager(300, 70);
      const sut4 = new VoteManager(10, 1);

      const result1 = sut1.grade;
      const result2 = sut2.grade;
      const result3 = sut3.grade;
      const result4 = sut4.grade;

      expect(result1).toEqual(voteGradeScale.positive);
      expect(result2).toEqual(voteGradeScale.positive);
      expect(result3).toEqual(voteGradeScale.positive);
      expect(result4).toEqual(voteGradeScale.positive);
    });

    test('Should return voteGradeScale.veryPositive ', () => {
      const sut1 = new VoteManager(250, 40);
      const sut2 = new VoteManager(1500, 300);
      const sut3 = new VoteManager(24, 1);

      const result1 = sut1.grade;
      const result2 = sut2.grade;
      const result3 = sut3.grade;

      expect(result1).toEqual(voteGradeScale.veryPositive);
      expect(result2).toEqual(voteGradeScale.veryPositive);
      expect(result3).toEqual(voteGradeScale.veryPositive);
    });
  });

  describe('VoteManager.exchangeVote', () => {
    const makeSut = () => {
      return { sut: new VoteManager(5, 3) };
    };

    test('Should decrement upvotes and increment downvotes when changing from up to down', () => {
      const { sut } = makeSut();

      sut.exchangeVote(VoteTypes.up, VoteTypes.down);

      expect(sut.props.upvotes).toBe(4);
      expect(sut.props.downvotes).toBe(4);
    });

    test('Should increment upvotes and decrement downvotes when changing from down to up', () => {
      const { sut } = makeSut();

      sut.exchangeVote(VoteTypes.down, VoteTypes.up);

      expect(sut.props.upvotes).toBe(6);
      expect(sut.props.downvotes).toBe(2);
    });

    test('Should not change votes if changing from up to up', () => {
      const { sut } = makeSut();

      sut.exchangeVote(VoteTypes.up, VoteTypes.up);

      expect(sut.props.upvotes).toBe(5);
      expect(sut.props.downvotes).toBe(3);
    });

    test('Should not change votes if changing from down to down', () => {
      const { sut } = makeSut();

      sut.exchangeVote(VoteTypes.down, VoteTypes.down);

      expect(sut.props.upvotes).toBe(5);
      expect(sut.props.downvotes).toBe(3);
    });

    test('Should handle multiple exchanges correctly', () => {
      const { sut } = makeSut();

      sut.exchangeVote(VoteTypes.up, VoteTypes.down);
      sut.exchangeVote(VoteTypes.down, VoteTypes.up);

      expect(sut.props.upvotes).toBe(5);
      expect(sut.props.downvotes).toBe(3);
    });
  });

  describe('VoteManager.removeVote', () => {
    const makeSut = () => {
      return { sut: new VoteManager(5, 3) };
    };

    test('Should decrement downvotes when removing a downvote', () => {
      const { sut } = makeSut();

      sut.removeVote(VoteTypes.down);

      expect(sut.props.upvotes).toBe(5);
      expect(sut.props.downvotes).toBe(2);
    });

    test('Should ddecrement upvotes when removing an upvote', () => {
      const { sut } = makeSut();

      sut.removeVote(VoteTypes.up);

      expect(sut.props.upvotes).toBe(4);
      expect(sut.props.downvotes).toBe(3);
    });

    test('Should not decrement anything if invalid vote type is passed', () => {
      const { sut } = makeSut();

      sut.removeVote('invalid' as keyof typeof VoteTypes);

      expect(sut.props.upvotes).toBe(5);
      expect(sut.props.downvotes).toBe(3);
    });

    test('Should should handle multiple removals correctly', () => {
      const { sut } = makeSut();

      sut.removeVote(VoteTypes.up);
      sut.removeVote(VoteTypes.down);

      expect(sut.props.upvotes).toBe(4);
      expect(sut.props.downvotes).toBe(2);
    });
  });
});
