import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

export class FindUserCountDto {
  @IsNumber()
  @ApiProperty({ description: '사용자 수' })
  count: number; // Number타입: 9,007,199,254,740,991명 이하 사용자시 안전함. (9천조 명)

  @IsBoolean()
  @ApiProperty({ description: '레벨테스트를 마친 사용자만 가져올지 여부' })
  levelTestedOnly: boolean;
}
