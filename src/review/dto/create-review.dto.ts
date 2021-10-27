import { IsString, isEnum, IsEnum } from 'class-validator';
import { HOT_LEVEL } from 'src/common/enums/hot-level';
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
  @IsString({ each: true })
  @ApiProperty({ description: '음식 태그 id' })
  tagIds: string[];
}
