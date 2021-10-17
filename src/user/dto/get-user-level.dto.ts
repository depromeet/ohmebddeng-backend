import { IsString } from 'class-validator';
import { UserLevel } from '../entities/user_level.entity';

export class GetUserLevelDto {
  @IsString()
  userId: string;

  userLevel: UserLevel;
}
