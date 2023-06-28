import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { ERROR_MESSAGES } from 'src/utils/constants';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception?.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;

    const res =
      exception instanceof HttpException
        ? exception.getResponse()
        : { success: false, message: ERROR_MESSAGES.UNKNOWN_ERROR };

    response.status(status).json(
      Object.assign(res, {
        data: {
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
        },
      }),
    );
  }
}
