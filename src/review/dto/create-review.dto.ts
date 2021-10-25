import { IsString } from 'class-validator';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto 
{
    @IsString()
    @ApiProperty({ description: '음식 레벨 id' })
    hotLevelId: string;
    @IsString()
    @ApiProperty({ description: '사용자 id' })
    userId: string;
    @IsString()
    @ApiProperty({ description: '음식 id' })
    foodId: string;
    @IsString({each: true})
    @ApiProperty({ description: '음식 태그 id' })
    tagIds: string[];
}
