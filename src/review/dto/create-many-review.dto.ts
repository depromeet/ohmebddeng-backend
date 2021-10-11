import { IsString } from 'class-validator';
import { CreateReviewDto } from './create-review.dto'

export class CreateManyReviewDto 
{
    dtoList: CreateReviewDto[];
}
