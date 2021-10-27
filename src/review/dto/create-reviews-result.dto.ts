import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CreateReviewsResultDto {
  @IsString()
  @ApiProperty({ description: '유저 id'})
  userId: string;

  @IsNumber()
  @ApiProperty({ description: '생성된 리뷰 길이'})
  reviewLength: number;
}
