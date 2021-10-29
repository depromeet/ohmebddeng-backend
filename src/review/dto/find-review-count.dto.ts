import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { HOT_LEVEL } from 'src/common/enums/hot-level';
import { TASTE_TAG } from 'src/common/enums/taste-tag';

export type HotLevelCountType = {
  [key in HOT_LEVEL]: number;
};

export type TasteTagCountType = {
  [key in TASTE_TAG]: number;
};

export class FindReviewCountDto {
  @IsObject()
  @ApiProperty({
    description: '음식의 맵기 레벨에 대한 다른 사용자들의 평가 통계',
  })
  hotLevelCount: Omit<HotLevelCountType, HOT_LEVEL.NEVER_TRIED>;

  @IsObject()
  @ApiProperty({
    description: '음식의 맛 태그에 대한 다른 사용자들의 평가 통계',
  })
  tasteTagCount: TasteTagCountType;
}
