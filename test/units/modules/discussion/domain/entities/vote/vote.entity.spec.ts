import { InspetorError } from '@common/core/inspetor';
import {
  VoteFor,
  VoteTypes,
} from '@modules/discussion/domain/component/voteManager.component';
import { Vote } from '@modules/discussion/domain/entities/vote/vote.entity';

describe('Vote', () => {
  const makeSut = () => {
    const validInput = {
      user: 'user123',
      voteType: VoteTypes.up,
      voteFor: VoteFor.comment,
      voteForReferency: 'comment123',
      createdAt: new Date(),
      updatedAt: new Date(),
      id: 'vote1',
    };

    const sut = Vote;

    return { validInput, sut };
  };

  describe('create', () => {
    test('should create a valid Vote instance', () => {
      const { sut, validInput } = makeSut();

      const result = sut.create(validInput);
      expect(result.isRight()).toBe(true);

      if (result.isRight()) {
        expect(result.value.props).toEqual(validInput);
      }
    });

    test('should return an error if user is falsy', () => {
      const { sut, validInput } = makeSut();
      const inputWithInvalidUser = { ...validInput, user: '' };

      const result = sut.create(inputWithInvalidUser);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(InspetorError);
    });

    test('should return an error if voteType is invalid', () => {
      const { sut, validInput } = makeSut();
      const inputWithInvalidVoteType = {
        ...validInput,
        voteType: 'invalidVoteType' as keyof typeof VoteTypes,
      };

      const result = sut.create(inputWithInvalidVoteType);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(InspetorError);
    });

    test('should return an error if voteFor is invalid', () => {
      const { sut, validInput } = makeSut();
      const inputWithInvalidVoteFor = {
        ...validInput,
        voteFor: 'invalidVoteFor' as keyof typeof VoteFor,
      };

      const result = sut.create(inputWithInvalidVoteFor);

      expect(result.isLeft()).toBe(true);
      expect(result.value).toBeInstanceOf(InspetorError);
    });
  });

  describe('setVoteType', () => {
    test('should update the voteType correctly', () => {
      const { sut, validInput } = makeSut();

      const result = sut.create(validInput).value as Vote;
      result.setVoteType(VoteTypes.down);

      expect(result.props.voteType).toBe(VoteTypes.down);
    });

    test('should keep voteType unchanged if invalid type is passed', () => {
      const { sut, validInput } = makeSut();

      const result = sut.create(validInput).value as Vote;

      // Attempting to set an invalid voteType (TypeScript will catch this, but for runtime tests, you can simulate)
      result.setVoteType('invalidVoteType' as any);

      expect(result.props.voteType).toBe(VoteTypes.up); // Should remain as 'up'
    });
  });

  describe('validateCreateInput', () => {
    test('should return right if input is valid', () => {
      const { sut, validInput } = makeSut();

      const result = sut.validateCreateInput(validInput);

      expect(result.isRight()).toBe(true);
      expect(result.value).toBe(true);
    });

    test('should return left if user is falsy', () => {
      const { sut, validInput } = makeSut();
      const inputWithInvalidUser = { ...validInput, user: '' };

      const result = sut.validateCreateInput(inputWithInvalidUser);

      expect(result.isLeft()).toBe(true);
    });

    test('should return left if voteType is invalid', () => {
      const { sut, validInput } = makeSut();
      const inputWithInvalidVoteType = {
        ...validInput,
        voteType: 'invalidVoteType' as keyof typeof VoteTypes,
      };

      const result = sut.validateCreateInput(inputWithInvalidVoteType);

      expect(result.isLeft()).toBe(true);
    });

    test('should return left if voteFor is invalid', () => {
      const { sut, validInput } = makeSut();
      const inputWithInvalidVoteFor = {
        ...validInput,
        voteFor: 'invalidVoteFor' as keyof typeof VoteFor,
      };

      const result = sut.validateCreateInput(inputWithInvalidVoteFor);

      expect(result.isLeft()).toBe(true);
    });

    test('should return left if voteForReferency is falsy', () => {
      const { sut, validInput } = makeSut();
      const inputWithInvalidReferency = {
        ...validInput,
        voteForReferency: '',
      };

      const result = sut.validateCreateInput(inputWithInvalidReferency);

      expect(result.isLeft()).toBe(true);
    });
  });
});
