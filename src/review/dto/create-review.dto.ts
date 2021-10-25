import { IsString , isEnum, IsEnum} from 'class-validator';
import { HOT_LEVEL } from 'src/food/enums/hot-level';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';


export class CreateReviewDto 
{
    @IsEnum(HOT_LEVEL)
    @ApiProperty({ description: '음식 레벨 id' })
    hotLevel: HOT_LEVEL;
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
