import { TransactionService } from '@modules/shared/domain/transaction.service';

export class FakeTransactionService implements TransactionService {
  async startTransaction(): Promise<unknown> {
    return {};
  }
  async commitTransaction(): Promise<void> {}
  async abortTransaction(): Promise<void> {}
  getTransaction(): unknown {
    return {};
  }
}
