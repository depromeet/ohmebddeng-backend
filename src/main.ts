import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://ohmebddeng.kr',
        'https://www.ohmebddeng.kr',
        'https://ohmebddeng-frontend.vercel.app',
        'https://ohmebddeng-frontend-git-develop-waterplease.vercel.app',
      ],
      credentials: true,
    },
  });
  const port = 3000;

  const prefix = '/v1';
  app.setGlobalPrefix(prefix);

  const config = new DocumentBuilder()
    .setTitle('오맵땡 Server API')
    .setDescription('오맵땡 API 명세서')
    .setVersion('Dev_1.0')
    .build();

  const swagger = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, swagger);

  await app.listen(port);

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: true,
    }),
  );
}
bootstrap();
