import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { Either } from '@common/core/either';
import { TransactionService } from '@modules/shared/domain/transaction.service';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly transactionService: TransactionService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    try {
      /**
       * Não abre transação! Isso é feito via serviço
       * Deve verificar se existe uma transação aberta
       * Se não existir, retorna o valor
       * Se existir,
       *    Se o retultado for erro, aborta a transaction
       *    Se o resultado não ser erro, commit a transaction
       */
      return next.handle().pipe(
        tap(async (result: Either<any, any> | any) => {
          const hasTransaction = !!this.transactionService.getTransaction();

          if (!hasTransaction) return result;

          await this.transactionService.commitTransaction();

          return result;
        }),
        catchError(async (error) => {
          const hasTransaction = !!this.transactionService.getTransaction();

          if (hasTransaction) {
            await this.transactionService.abortTransaction();
          }

          throw error;
        }),
      );
    } catch (error) {
      const hasTransaction = !!this.transactionService.getTransaction();

      if (hasTransaction) {
        await this.transactionService.abortTransaction();
      }

      throw error;
    }
  }
}
