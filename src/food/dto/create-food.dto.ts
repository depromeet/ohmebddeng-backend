import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Food } from '../entities/food.entity';
@ApiExtraModels(Food)
export class CreateFoodDto {
  @IsString()
  @ApiProperty({ description: '음식 이름', type: String })
  name: string;

  @IsString()
  @ApiProperty({
    description: '음식 맛 ex) 순한맛, 매운맛, 1단계, 2단계',
    type: String,
  })
  subName: string;

  @IsString()
  @ApiProperty({ description: '음식 레벨', type: String })
  level: string;

  @IsString()
  @ApiProperty({ description: '음식 카테고리', type: String })
  category: string;
}
