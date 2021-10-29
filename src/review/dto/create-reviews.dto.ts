import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsEnum } from 'class-validator';
import { HOT_LEVEL } from 'src/common/enums/hot-level';

export class ReviewDto {
  @IsEnum(HOT_LEVEL)
  @ApiProperty({
    description:
      "음식 레벨 ex) 'EASY', 'NORMAL', 'HOT', 'HOTTEST', 'NEVER_TRIED'",
    type: HOT_LEVEL,
  })
  hotLevel: HOT_LEVEL;

  @IsString()
  @ApiProperty({ description: '음식 id' })
  foodId: string;

  @IsString({ each: true })
  @ApiProperty({ description: '음식 맛평가 태그 id' })
  tagIds: string[];
}

export class CreateReviewsDto {
  @IsString()
  @ApiProperty({ description: '유저 id' })
  userId: string;

  @IsArray()
  @ApiProperty({ description: '리뷰 클래스의 배열', type: [ReviewDto] })
  reviewList: ReviewDto[];
}
