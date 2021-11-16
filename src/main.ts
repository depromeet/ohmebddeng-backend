import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * dev/prod에 따라 access-control-allow-origin을 다르게 적용함
 * DEV: localhost, dev 배포된 front-end app, prod 배포된 front-end app
 * PROD: ohmebddeng.kr, www.ohmebddeng.kr
 */
const origin =
  process.env.NODE_ENV === 'development'
    ? [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://ohmebddeng.kr',
        'https://www.ohmebddeng.kr',
        'https://ohmebddeng-frontend.vercel.app',
        'https://ohmebddeng-frontend-git-develop-waterplease.vercel.app',
      ]
    : ['https://ohmebddeng.kr', 'https://www.ohmebddeng.kr'];

const PORT = 3000;
const PREFIX = '/v1';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin,
      credentials: true,
    },
  });

  app.setGlobalPrefix(PREFIX, {
    exclude: [{ path: '/', method: RequestMethod.GET }],
  });

  const config = new DocumentBuilder()
    .setTitle('오맵땡 Server API')
    .setDescription('오맵땡 API 명세서')
    .setVersion('Dev_1.0')
    .build();

  const swagger = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, swagger);

  await app.listen(PORT);

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
    }),
  );
}
bootstrap();
