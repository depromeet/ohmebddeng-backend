import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
<<<<<<< HEAD
import { APP_PIPE } from '@nestjs/core';
=======
import { TypeOrmModule } from '@nestjs/typeorm';

>>>>>>> feat-#3
@Module({
  imports: [TypeOrmModule.forRoot()], // ormconfig.json값을 가져옴
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
