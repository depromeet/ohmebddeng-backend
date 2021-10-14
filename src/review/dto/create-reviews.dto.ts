import { IsString, IsArray } from 'class-validator';

export interface IReview {
  hotLevelId: string;
  foodId: string;
  tagIds: string[];
}

export class CreateReviewsDto {
  @IsString()
  userId: string;

  @IsArray()
  reviewList: IReview[];
}
