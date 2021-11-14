import { HttpService } from '@nestjs/axios';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
// import axios from 'axios';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  constructor(private httpService: HttpService) {}
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const statusCode = exception.getStatus();

    // Log on slack
    this.httpService
      .post(process.env.SLACK_WEBHOOK, {
        text: `
          🚨 *사용자 오류 발생* 🚨

            *✔️ Error Name:* ${exception.name}
            *✔️ message:* ${exception.message}
            *✔️ url:* ${request.url}

            *✔️ stack*
                ${exception.stack}
          `,
      })
      .subscribe();

    response.status(200).json({
      statusCode,
      message: exception.message,
    });
  }
}
