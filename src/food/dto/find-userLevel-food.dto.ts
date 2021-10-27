import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FindUserLevelFoodDto {
  @IsString()
  @ApiProperty({ description: '사용자 레벨' })
  userLevel: string;
}
