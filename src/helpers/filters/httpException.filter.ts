import { ApiPresenter } from '@common/infra/Api.presenter';
import { Environment } from '@modules/config/config.interface';
import { Config } from '@modules/config/ports/config';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';

@Catch()
export default class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly configService: Config) {}

  catch(exception: InternalServerErrorException | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const stack = exception.stack;
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : (exception.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR);

    const appConfig = this.configService.getAppConfig();
    const isDev = appConfig.env === Environment.dev;

    const apiPresenter = new ApiPresenter({
      description: exception?.options?.description,
      path: request.url,
      method: request.method,
      status,
      type: exception.name,
      error: { message: exception.message, errorMessages: exception.messages },
      stack: isDev ? stack : undefined,
    });

    if (isDev) {
      const copyResponse = { ...apiPresenter };
      delete copyResponse.stack;
      console.error(copyResponse, '\n', stack);
    }

    response.status(status).json(apiPresenter);
  }
}
