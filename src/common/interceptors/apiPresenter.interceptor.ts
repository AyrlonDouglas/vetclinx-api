import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ApiPresenter } from '@common/infra/Api.presenter';

@Injectable()
export class ApiPresenterInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      map((result: any) => {
        if (result instanceof ApiPresenter) {
          const ctx = context.switchToHttp();
          const request = ctx.getRequest();
          const response = ctx.getResponse();
          result.path = request.url;
          result.method = request.method;
          result.status = result.status ?? response.statusCode;
        }

        return result;
      }),
    );
  }
}
