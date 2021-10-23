import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Food } from '../entities/food.entity';
@ApiExtraModels(Food)
export class CreateFoodDto {
  @IsString()
  @ApiProperty({ description: '음식 이름', type: String })
  name: string;

  @IsString()
  @ApiProperty({ description: '음식 레벨', type: String })
  level: string;

  @IsString()
  @ApiProperty({ description: '음식 카테고리', type: String })
  category: string;
}
