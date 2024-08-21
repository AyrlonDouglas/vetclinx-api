import {
  voteGradeScale,
  VoteManager,
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
});
