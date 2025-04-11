import { Either, left, right } from './either';

import Inspector, {
  InspectorArgumentCollection,
  InspectorResponse,
  InspectorError,
  INSPECTOR_RIGHT_VALUE,
} from './inspector';
export class InspectorBuilder {
  private conditions: (() => Either<InspectorError, InspectorResponse>)[] = [];

  greaterThan(minValue: number, actualValue: number) {
    this.conditions.push(() => Inspector.greaterThan(minValue, actualValue));
    return this;
  }

  againstAtLeast(numChars: number, text: string) {
    this.conditions.push(() => Inspector.againstAtLeast(numChars, text));
    return this;
  }

  againstAtMost(numChars: number, text: string) {
    this.conditions.push(() => Inspector.againstAtMost(numChars, text));
    return this;
  }

  againstNullOrUndefined(argument: unknown, argumentName: string) {
    this.conditions.push(() =>
      Inspector.againstNullOrUndefined(argument, argumentName),
    );
    return this;
  }

  againstNullOrUndefinedBulk(args: InspectorArgumentCollection) {
    this.conditions.push(() => Inspector.againstNullOrUndefinedBulk(args));
    return this;
  }

  againstFalsy(argument: unknown, argumentName: string) {
    this.conditions.push(() => Inspector.againstFalsy(argument, argumentName));
    return this;
  }

  againstFalsyBulk(args: InspectorArgumentCollection) {
    this.conditions.push(() => Inspector.againstFalsyBulk(args));
    return this;
  }

  isOneOf(value: unknown, validValues: unknown[], argumentName: string) {
    this.conditions.push(() =>
      Inspector.isOneOf(value, validValues, argumentName),
    );
    return this;
  }

  atLeastOneTruthy(args: InspectorArgumentCollection) {
    this.conditions.push(() => Inspector.atLeastOneTruthy(args));
    return this;
  }

  get inspect(): Either<InspectorError, InspectorResponse> {
    const isLeft = [];

    for (const condition of this.conditions) {
      const result = condition();
      if (result.isLeft()) {
        isLeft.push(result.value.messages);
      }
    }

    return isLeft.length
      ? left(new InspectorError(isLeft.flat()))
      : right(INSPECTOR_RIGHT_VALUE);
  }
}
