import { IsArray, IsString } from 'class-validator';
import { IReview } from 'src/review/dto/create-reviews.dto';

export class CreateUserLevelDto {
  @IsString()
  userId: string;

  @IsArray()
  answers: Pick<IReview, 'foodId' | 'hotLevelId'>[];
}
