import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class FindUserLevelFoodDto {
  @IsNumberString()
  @ApiProperty({ description: '사용자 레벨' })
  userLevel: string;
}
