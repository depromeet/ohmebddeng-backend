import internal from "stream";
import { IsString } from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';
import { Review } from '../entities/review.entity'

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
