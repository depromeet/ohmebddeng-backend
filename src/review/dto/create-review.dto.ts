import internal from "stream";
import { IsString, IsNumber, IsDate, IsBoolean } from 'class-validator';

export class CreateReviewDto 
{
    hotlevelId: number;
    userId: number;
    foodId: number;

}
