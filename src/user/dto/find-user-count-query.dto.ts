import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString } from 'class-validator';

export class FindUserCountQueryDto {
  @IsBooleanString()
  @ApiProperty({ description: '레벨테스트를 마친 사용자만 가져올지 여부' })
  levelTestedOnly: string;
}
