import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray } from 'class-validator';

export class IReview {
  @IsString()
  @ApiProperty({ description: '음식 레벨 id'})
  hotLevelId: string;
  @IsString()
  @ApiProperty({ description: '음식 id'})
  foodId: string;
  @IsString({each: true})
  @ApiProperty({ description: '음식 맛평가 태그 id'})
  tagIds: string[];
}

export class CreateReviewsDto {
  @IsString()
  @ApiProperty({ description: '유저 id'})
  userId: string;

  @IsArray()
  @ApiProperty({ description: '리뷰 인터페이스의 배열'})
  reviewList: IReview[];
}
