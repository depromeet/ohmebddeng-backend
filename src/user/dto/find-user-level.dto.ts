import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { UserLevel } from '../entities/user_level.entity';
import { UserLevelDetail } from '../entities/user_level_detail.entity';

@ApiExtraModels(UserLevelDetail, UserLevel)
export class FindUserLevelDto {
  @IsString()
  @ApiProperty({ description: '사용자 ID' })
  userId: string;

  @ApiProperty({ description: '사용자 레벨 정보', type: () => UserLevel })
  userLevel: UserLevel;
}
