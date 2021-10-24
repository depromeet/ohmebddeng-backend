import { IsString, IsArray, IsEnum } from 'class-validator';
import { HOT_LEVEL } from 'src/food/enums/hot-level';

export class Review {
  @IsEnum(HOT_LEVEL)
  hotLevel: HOT_LEVEL;

  @IsString()
  foodId: string;

  @IsString({ each: true })
  tagIds: string[];
}

export class CreateReviewsDto {
  @IsString()
  userId: string;

  @IsArray()
  reviewList: Review[];
}
