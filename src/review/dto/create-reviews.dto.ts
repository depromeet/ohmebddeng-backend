import { IsString, IsArray} from 'class-validator';
import { CreateReviewDto } from './create-review.dto'

interface IReview {
    hotLevelId: string;
    foodId: string;
    tagIds: string[];
}

export class CreateReviewsDto 
{
    @IsString()
    userId: string;
    @IsArray()
    reviewList: IReview[];
}
