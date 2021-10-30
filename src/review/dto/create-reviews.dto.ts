import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsEnum } from 'class-validator';
import { HOT_LEVEL } from 'src/common/enums/hot-level';
import { TASTE_TAG } from 'src/common/enums/taste-tag';

export class ReviewDto {
  @IsEnum(HOT_LEVEL)
  @ApiProperty({
    description:
      "음식 레벨 ex) 'EASY', 'NORMAL', 'HOT', 'HOTTEST', 'NEVER_TRIED'",
  })
  hotLevel: HOT_LEVEL;

  @IsString()
  @ApiProperty({ description: '음식 id' })
  foodId: string;

  @IsEnum(TASTE_TAG, {each: true})
  @ApiProperty({ description: "음식 태그 ex) '얼얼한', '칼칼한', '매콤달콤한', '알싸한', '얼큰한', '개운한'", })
  tagIds: TASTE_TAG[];
}

export class CreateReviewsDto {
  @IsString()
  @ApiProperty({ description: '유저 id' })
  userId: string;

  @IsArray()
  @ApiProperty({ description: '리뷰 클래스의 배열', type: [ReviewDto] })
  reviewList: ReviewDto[];
}
