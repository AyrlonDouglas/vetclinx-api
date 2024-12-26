import { TransactionService } from '@modules/shared/domain/transaction.service';

export class FakeTransactionService implements TransactionService {
  getEntityManager(): unknown {
    throw new Error('Method not implemented.');
  }
  async startTransaction(): Promise<void> {
    return;
  }
  async commitTransaction(): Promise<void> {}
  async abortTransaction(): Promise<void> {}
  getTransaction(): unknown {
    return {};
  }
}
