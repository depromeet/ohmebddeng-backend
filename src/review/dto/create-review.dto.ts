import internal from "stream";
import { IsString } from 'class-validator';

export class CreateReviewDto 
{
    @IsString()
    hotlevelId: string;
    @IsString()
    userId: string;
    @IsString()
    foodId: string;
    @IsString({each: true})
    TagIds: string[];
}
