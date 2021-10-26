import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsString } from 'class-validator';
import { HOT_LEVEL } from '../../common/enums/hot-level';

export class FindFoodDto {
  @IsNumberString()
  @ApiProperty({ description: '음식 id' })
  id: string;

  @IsString()
  @ApiProperty({ description: '음식명' })
  name: string;

  @IsString()
  @ApiProperty({ description: '음식 부제목' })
  subName: string;

  @IsString()
  @ApiProperty({ description: '음식 이미지', type: String || null })
  imageUrl: string | null;

  @IsEnum(HOT_LEVEL)
  @ApiProperty({ description: '음식의 맵기 레벨', enum: HOT_LEVEL })
  hotLevel: HOT_LEVEL;
}