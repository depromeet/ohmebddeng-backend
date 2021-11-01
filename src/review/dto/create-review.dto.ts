import { IsString, isEnum, IsEnum } from 'class-validator';
import { HOT_LEVEL } from 'src/common/enums/hot-level';
import { TASTE_TAG } from 'src/common/enums/taste-tag';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @IsEnum(HOT_LEVEL)
  @ApiProperty({
    description:
      "음식 레벨 ex) 'EASY', 'NORMAL', 'HOT', 'HOTTEST', 'NEVER_TRIED'",
  })
  hotLevel: HOT_LEVEL;

  @IsString()
  @ApiProperty({ description: '사용자 id' })
  userId: string;

  @IsString()
  @ApiProperty({ description: '음식 id' })
  foodId: string;

  @IsEnum(TASTE_TAG, {each: true})
  @ApiProperty({ description: "음식 태그 ex) '얼얼한', '칼칼한', '매콤달콤한', '알싸한', '얼큰한', '개운한'", })
  tags: TASTE_TAG[];
}
