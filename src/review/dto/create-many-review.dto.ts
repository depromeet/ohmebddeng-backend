import { IsString } from 'class-validator';
import { CreateReviewDto } from './create-review.dto'

interface Review {
    hotLevelId: string;
    foodId: string;
    tagIds: string[];
}

export class CreateManyReviewDto 
{
    userId: string;
    reviewList: Review[];
}
