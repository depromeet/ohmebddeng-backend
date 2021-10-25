import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateReviewResultDto {
  @IsString()
  @ApiProperty({ description: '유저 id'})
  userId: string;

  @IsString()
  @ApiProperty({ description: '음식 id'})
  foodId: string;
}
