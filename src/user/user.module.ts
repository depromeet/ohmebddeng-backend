import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRefreshToken } from './entities/user_refresh_token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRefreshToken])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
