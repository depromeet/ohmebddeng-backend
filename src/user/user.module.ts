import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRefreshToken } from './entities/user_refresh_token.entity';
import { Food } from 'src/food/entities/food.entity';
import { EvaluateUserLevel } from './utils/evaluate-user-level';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRefreshToken, Food])],
  controllers: [UserController],
  providers: [UserService, EvaluateUserLevel],
})
export class UserModule {}
