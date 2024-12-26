import { ContextStorageService } from '@modules/shared/domain/contextStorage.service';
import { TransactionService } from '@modules/shared/domain/transaction.service';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class PostgreTransactionService implements TransactionService {
  constructor(private readonly contextService: ContextStorageService) {}

  async startTransaction(): Promise<void> {
    const queryRunner = this.contextService.postgreQueryRunner;

    if (queryRunner.isTransactionActive) {
      return;
    }

    await queryRunner.startTransaction();
  }

  async commitTransaction(): Promise<void> {
    const queryRunner = this.contextService.postgreQueryRunner;

    if (!queryRunner.isTransactionActive) {
      return;
    }

    await queryRunner.commitTransaction();
  }

  async abortTransaction(): Promise<void> {
    const queryRunner = this.contextService.postgreQueryRunner;

    if (!queryRunner.isTransactionActive) {
      return;
    }

    await queryRunner.rollbackTransaction();
  }

  getTransaction(): unknown {
    throw new Error('Method not suported for postgre. Use getEntityManager');
  }

  getEntityManager(): EntityManager {
    const queryRunner = this.contextService.postgreQueryRunner;

    return queryRunner.manager;
  }
}
