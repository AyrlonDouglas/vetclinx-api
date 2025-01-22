export abstract class TransactionService {
  abstract startTransaction(): Promise<void>;
  abstract commitTransaction(): Promise<void>;
  abstract abortTransaction(): Promise<void>;
  abstract getTransaction(): unknown;
  abstract getEntityManager(): unknown;
}
