import { ContextStorageService } from '@modules/shared/domain/contextStorage.service';
import { TransactionService } from '@modules/shared/domain/transaction.service';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ClientSession, Connection } from 'mongoose';

@Injectable()
export class MongooseTransactionService implements TransactionService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly contextService: ContextStorageService,
  ) {}

  async startTransaction(): Promise<void> {
    const contextSession = this.contextService.session;
    const hasSession = !!contextSession;

    if (hasSession) {
      return;
    }

    const session = await this.connection.startSession();

    session.startTransaction();
    this.contextService.session = session; // Armazenar a sessão no contexto
  }

  async commitTransaction(): Promise<void> {
    const session = this.getTransaction();
    if (session) {
      await session.commitTransaction();
      session.endSession();
    }
  }

  async abortTransaction(): Promise<void> {
    const session = this.getTransaction();
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
  }

  getTransaction(): ClientSession | undefined {
    return this.contextService.session; // Retorna a sessão armazenada no contexto atual
  }

  getEntityManager(): unknown {
    throw new Error('Method not suported for mongoose. Use getTransaction');
  }
}
