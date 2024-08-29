import {
  AppConfig,
  ConfigKey,
  Environment,
} from '@modules/config/config.interface';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Catch()
export default class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: InternalServerErrorException | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const stack = exception.stack;
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : (exception.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR);
    /**
     * @description Exception json response
     * @param type
     * @param message
     * @param _status
     * @param errorMessages?
     */
    const responseMessage = (
      type: string,
      message: string,
      _status = status,
      description?: string,
      errorMessages?: string | string[],
    ) => {
      const appConfig = this.configService.get<AppConfig>(ConfigKey.app);
      const showStack = appConfig.env === Environment.dev;

      const errorResponse = {
        statusCode: _status,
        path: request.url,
        method: request.method,
        type,
        message,
        description,
        errorMessages,
        timestamp: new Date().getTime(),
        ...(showStack ? { stack } : {}),
      };

      response.status(_status).json(errorResponse);
    };

    if (status === 503) {
      response.status(status).json(exception.getResponse());
    } else {
      responseMessage(
        exception.name,
        exception.message,
        exception.status,
        exception?.options?.description,
        exception.messages,
      );
    }
  }
}
