export abstract class TransactionService {
  abstract startTransaction(): Promise<unknown>;
  abstract commitTransaction(): Promise<void>;
  abstract abortTransaction(): Promise<void>;
  abstract getTransaction(): unknown;
}
