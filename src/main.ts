import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3000;

  const config = new DocumentBuilder()
    .setTitle('Mab Master Server API')
    .setDescription('Mab Master API 명세서')
    .setVersion('Dev_1.0')
    .build();

  const swagger = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, swagger);

  await app.listen(port);
}
bootstrap();
