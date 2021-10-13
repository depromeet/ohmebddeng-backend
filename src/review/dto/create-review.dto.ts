import { IsString } from 'class-validator';

export class CreateReviewDto 
{
    @IsString()
    hotLevelId: string;
    @IsString()
    userId: string;
    @IsString()
    foodId: string;
    @IsString({each: true})
    tagIds: string[];
}
