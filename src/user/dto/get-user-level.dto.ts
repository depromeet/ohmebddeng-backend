import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserLevel } from '../entities/user_level.entity';

export class findUserLevelDto {
  @IsString()
  @ApiProperty({ description: '사용자 ID' })
  userId: string;

  @ApiProperty({ description: '사용자 레벨 정보' })
  userLevel: UserLevel;
}
