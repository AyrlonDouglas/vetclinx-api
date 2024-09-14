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

  async startTransaction(): Promise<unknown> {
    const contextSession = this.contextService.get('session');
    const hasSession = !!contextSession;

    if (hasSession) {
      return;
    }
    const session: ClientSession = await this.connection.startSession();

    session.startTransaction();
    this.contextService.set('session', session); // Armazenar a sessão no contexto
    return session;
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
    return this.contextService.get('session'); // Retorna a sessão armazenada no contexto atual
  }
}
