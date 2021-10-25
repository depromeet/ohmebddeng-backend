import { ApiProperty } from '@nestjs/swagger';
import { IsArray,  IsEnum } from 'class-validator';
import { HOT_LEVEL } from 'src/food/enums/hot-level';
import { Review } from '../entities/review.entity'


export class FindReviewDto {
  @ApiProperty({ description: '유저 id'})
  review: Review;

  @IsEnum(HOT_LEVEL)
  @ApiProperty({ description: '생성된 리뷰 길이'})
  hotLevel: HOT_LEVEL;
}

export class FindReviewsDto {
    @IsArray()
    @ApiProperty({ description: '리뮤 클래스의 배열'})
    reviewList: Review[];
}