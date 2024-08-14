export default abstract class HashService {
  abstract genSalt(round: number): Promise<string>;
  abstract hash(
    data: string | Buffer,
    saltOrRounds?: string | number,
  ): Promise<string>;
  abstract compare(data: string | Buffer, encrypted: string): Promise<boolean>;
}
