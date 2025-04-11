import BaseError from '@common/errors/baseError.error';
import { Either, left, right } from './either';
import { HttpStatusCode } from '@common/http/httpStatusCode';

export type InspectorResponse = string;

export interface IInspectorArgument {
  argument: any;
  argumentName: string;
}

export type InspectorArgumentCollection = IInspectorArgument[];

export const INSPECTOR_RIGHT_VALUE = 'ok';

export class InspectorError extends BaseError {
  constructor(message: string | string[]) {
    super(
      [...(Array.isArray(message) ? message : [message])],
      HttpStatusCode.NOT_ACCEPTABLE,
    );
    this.name = 'InspectorError';
  }
}

export default class Inspector {
  public static combine(eitherResults: Either<any, any>[]) {
    const leftFound = eitherResults.find((result) => result.isLeft());
    return leftFound ? leftFound : right(INSPECTOR_RIGHT_VALUE);
  }

  public static greaterThan(
    minValue: number,
    actualValue: number,
  ): Either<InspectorError, InspectorResponse> {
    return actualValue > minValue
      ? right(INSPECTOR_RIGHT_VALUE)
      : left(
          new InspectorError(
            `Number given {${actualValue}} is not greater than {${minValue}}`,
          ),
        );
  }

  public static againstAtLeast(
    numChars: number,
    text: string,
  ): Either<InspectorError, InspectorResponse> {
    return text.length >= numChars
      ? right(INSPECTOR_RIGHT_VALUE)
      : left(new InspectorError(`Text is not at least ${numChars} chars.`));
  }

  public static againstAtMost(
    numChars: number,
    text: string,
  ): Either<InspectorError, InspectorResponse> {
    return text.length <= numChars
      ? right(INSPECTOR_RIGHT_VALUE)
      : left(new InspectorError(`Text is greater than ${numChars} chars.`));
  }

  public static againstNullOrUndefined(
    argument: any,
    argumentName: string,
  ): Either<InspectorError, InspectorResponse> {
    if (argument === null || argument === undefined) {
      return left(new InspectorError(`${argumentName} is null or undefined`));
    } else {
      return right(INSPECTOR_RIGHT_VALUE);
    }
  }

  public static againstNullOrUndefinedBulk(
    args: InspectorArgumentCollection,
  ): Either<InspectorError, InspectorResponse> {
    for (const arg of args) {
      const result = this.againstNullOrUndefined(
        arg.argument,
        arg.argumentName,
      );
      if (result.isLeft()) return result;
    }

    return right(INSPECTOR_RIGHT_VALUE);
  }

  public static againstFalsy(
    argument: any,
    argumentName: string,
  ): Either<InspectorError, InspectorResponse> {
    if (!!argument === false) {
      return left(new InspectorError(`${argumentName} is falsy`));
    } else {
      return right(INSPECTOR_RIGHT_VALUE);
    }
  }

  public static againstFalsyBulk(
    args: InspectorArgumentCollection,
  ): Either<InspectorError, InspectorResponse> {
    for (const arg of args) {
      const result = this.againstFalsy(arg.argument, arg.argumentName);
      if (result.isLeft()) return result;
    }

    return right(INSPECTOR_RIGHT_VALUE);
  }

  public static isOneOf(
    value: any,
    validValues: any[],
    argumentName: string,
  ): Either<InspectorError, InspectorResponse> {
    let isValid = false;
    for (const validValue of validValues) {
      if (value === validValue) {
        isValid = true;
      }
    }

    if (isValid) {
      return right(INSPECTOR_RIGHT_VALUE);
    } else {
      return left(
        new InspectorError(
          `${argumentName} isn't oneOf the correct types in ${JSON.stringify(validValues)}. Got "${value}".`,
        ),
      );
    }
  }

  public static atLeastOneTruthy(
    args: InspectorArgumentCollection,
  ): Either<InspectorError, InspectorResponse> {
    const allFalsy = args.every((arg) => !arg.argument);

    if (allFalsy) {
      return left(
        new InspectorError(
          `All arguments ${args.map((e) => e.argumentName).join(', ')} are falsy.`,
        ),
      );
    } else {
      return right(INSPECTOR_RIGHT_VALUE);
    }
  }

  // public static inRange(
  //   num: number,
  //   min: number,
  //   max: number,
  //   argumentName: string,
  // ): Result<InspectorResponse> {
  //   const isInRange = num >= min && num <= max;
  //   if (!isInRange) {
  //     return Result.fail<InspectorResponse>(
  //       `${argumentName} is not within range ${min} to ${max}.`,
  //     );
  //   } else {
  //     return Result.ok<InspectorResponse>();
  //   }
  // }

  // public static allInRange(
  //   numbers: number[],
  //   min: number,
  //   max: number,
  //   argumentName: string,
  // ): Result<InspectorResponse> {
  //   let failingResult: Result<InspectorResponse> = null;

  //   for (const num of numbers) {
  //     const numIsInRangeResult = this.inRange(num, min, max, argumentName);
  //     if (!numIsInRangeResult.isFailure) failingResult = numIsInRangeResult;
  //   }

  //   if (failingResult) {
  //     return Result.fail<InspectorResponse>(
  //       `${argumentName} is not within the range.`,
  //     );
  //   } else {
  //     return Result.ok<InspectorResponse>();
  //   }
  // }
}
