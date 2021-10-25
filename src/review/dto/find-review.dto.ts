import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateReviewsResultDto {
  @IsString()
  @ApiProperty({ description: '유저 id'})
  review: string;

  @IsString()
  @ApiProperty({ description: '생성된 리뷰 길이'})
  hotLevel: string;
}
