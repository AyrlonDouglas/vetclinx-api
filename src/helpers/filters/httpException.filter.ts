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
  catch(exception: InternalServerErrorException | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const stack = exception.stack;
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : exception.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;
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
      const errorResponse = {
        statusCode: _status,
        path: request.url,
        method: request.method,
        type,
        message,
        description,
        errorMessages,
        timestamp: new Date().getTime(),
        stack,
        // ...(['development', 'test'].includes(process.env.NODE_ENV)
        //   ? { stack }
        //   : {}),
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
