export abstract class Mapper<T> {
  abstract toPersistense(data: T): any;
  abstract toDomain(data: any): T;
  abstract toDTO(data: T): any;
}
