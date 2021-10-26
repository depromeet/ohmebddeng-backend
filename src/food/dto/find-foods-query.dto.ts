import { ApiProperty } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { SORT } from 'src/common/enums/sort';
import { HOT_LEVEL } from '../../common/enums/hot-level';

export class FindFoodsQueryDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: '사용자 id', required: false })
  userId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '카테고리', required: false })
  category?: string;

  @IsEnum(HOT_LEVEL)
  @IsOptional()
  @ApiProperty({ description: '가져오려는 음식의 맵기 레벨', required: false })
  hotLevel: HOT_LEVEL;

  @IsNumberString()
  @IsOptional()
  @ApiProperty({ description: '가져오려는 음식의 개수', required: false })
  size: string;

  @IsEnum(SORT)
  @IsOptional()
  @ApiProperty({
    description: '가져오려는 음식의 개수',
    required: false,
    enum: SORT,
  })
  sort: SORT;
}
