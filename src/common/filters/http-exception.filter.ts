import { HttpService } from '@nestjs/axios';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  constructor(private httpService: HttpService) {}
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const statusCode = exception.getStatus();

    // Log on slack only in production mode
    if (process.env.NODE_ENV === 'production') {
      this.httpService
        .post(process.env.SLACK_WEBHOOK, {
          text: `
          🚨 *사용자 오류 발생* 🚨

            *✔️ 에러 명:* ${exception.name}
            *✔️ 메세지:* ${exception.message}
            *✔️ URL:* ${request.url}
          `,
        })
        .subscribe();
    }

    response.status(200).json({
      statusCode,
      message: exception.message,
    });
  }
}
