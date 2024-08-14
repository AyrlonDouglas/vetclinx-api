export default abstract class ValueObject<T> {
  constructor(protected readonly content: T) {}

  equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    return JSON.stringify(this.content) === JSON.stringify(vo.content);
  }
}
