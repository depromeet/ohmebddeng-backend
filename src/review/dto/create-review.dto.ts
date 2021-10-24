import { IsString, IsEnum } from 'class-validator';
import { HOT_LEVEL } from 'src/food/enums/hot-level';

export class CreateReviewDto {
  @IsEnum(HOT_LEVEL)
  hotLevel: HOT_LEVEL;

  @IsString()
  userId: string;

  @IsString()
  foodId: string;

  @IsString({ each: true })
  tagIds: string[];
}
