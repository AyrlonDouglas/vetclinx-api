import { Either, left, right } from './either';

export type InspetorResponse = string;

export interface IInspectorArgument {
  argument: any;
  argumentName: string;
}

export type InspectorArgumentCollection = IInspectorArgument[];

const INSPETOR_RIGHT_VALUE = 'ok';

export class InspetorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InspetorError';
  }
}

export default class Inspetor {
  public static combine(eitherResults: Either<any, any>[]) {
    const leftFound = eitherResults.find((result) => result.isLeft());
    return leftFound ? leftFound : right(INSPETOR_RIGHT_VALUE);
  }

  public static greaterThan(
    minValue: number,
    actualValue: number,
  ): Either<InspetorError, InspetorResponse> {
    return actualValue > minValue
      ? right(INSPETOR_RIGHT_VALUE)
      : left(
          new InspetorError(
            `Number given {${actualValue}} is not greater than {${minValue}}`,
          ),
        );
  }

  public static againstAtLeast(
    numChars: number,
    text: string,
  ): Either<InspetorError, InspetorResponse> {
    return text.length >= numChars
      ? right(INSPETOR_RIGHT_VALUE)
      : left(new InspetorError(`Text is not at least ${numChars} chars.`));
  }

  public static againstAtMost(
    numChars: number,
    text: string,
  ): Either<InspetorError, InspetorResponse> {
    return text.length <= numChars
      ? right(INSPETOR_RIGHT_VALUE)
      : left(new InspetorError(`Text is greater than ${numChars} chars.`));
  }

  public static againstNullOrUndefined(
    argument: any,
    argumentName: string,
  ): Either<InspetorError, InspetorResponse> {
    if (argument === null || argument === undefined) {
      return left(new InspetorError(`${argumentName} is null or undefined`));
    } else {
      return right(INSPETOR_RIGHT_VALUE);
    }
  }

  public static againstNullOrUndefinedBulk(
    args: InspectorArgumentCollection,
  ): Either<InspetorError, InspetorResponse> {
    for (const arg of args) {
      const result = this.againstNullOrUndefined(
        arg.argument,
        arg.argumentName,
      );
      if (result.isLeft()) return result;
    }

    return right(INSPETOR_RIGHT_VALUE);
  }

  public static againstFalsy(
    argument: any,
    argumentName: string,
  ): Either<InspetorError, InspetorResponse> {
    if (!!argument === false) {
      return left(new InspetorError(`${argumentName} is falsy`));
    } else {
      return right(INSPETOR_RIGHT_VALUE);
    }
  }

  public static againstFalsyBulk(
    args: InspectorArgumentCollection,
  ): Either<InspetorError, InspetorResponse> {
    for (const arg of args) {
      const result = this.againstFalsy(arg.argument, arg.argumentName);
      if (result.isLeft()) return result;
    }

    return right(INSPETOR_RIGHT_VALUE);
  }

  public static isOneOf(
    value: any,
    validValues: any[],
    argumentName: string,
  ): Either<InspetorError, InspetorResponse> {
    let isValid = false;
    for (const validValue of validValues) {
      if (value === validValue) {
        isValid = true;
      }
    }

    if (isValid) {
      return right(INSPETOR_RIGHT_VALUE);
    } else {
      return left(
        new InspetorError(
          `${argumentName} isn't oneOf the correct types in ${JSON.stringify(validValues)}. Got "${value}".`,
        ),
      );
    }
  }

  // public static inRange(
  //   num: number,
  //   min: number,
  //   max: number,
  //   argumentName: string,
  // ): Result<InspetorResponse> {
  //   const isInRange = num >= min && num <= max;
  //   if (!isInRange) {
  //     return Result.fail<InspetorResponse>(
  //       `${argumentName} is not within range ${min} to ${max}.`,
  //     );
  //   } else {
  //     return Result.ok<InspetorResponse>();
  //   }
  // }

  // public static allInRange(
  //   numbers: number[],
  //   min: number,
  //   max: number,
  //   argumentName: string,
  // ): Result<InspetorResponse> {
  //   let failingResult: Result<InspetorResponse> = null;

  //   for (const num of numbers) {
  //     const numIsInRangeResult = this.inRange(num, min, max, argumentName);
  //     if (!numIsInRangeResult.isFailure) failingResult = numIsInRangeResult;
  //   }

  //   if (failingResult) {
  //     return Result.fail<InspetorResponse>(
  //       `${argumentName} is not within the range.`,
  //     );
  //   } else {
  //     return Result.ok<InspetorResponse>();
  //   }
  // }
}
