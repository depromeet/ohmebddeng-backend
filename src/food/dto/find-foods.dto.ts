import { ApiProperty } from '@nestjs/swagger';
import {
  IsBooleanString,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { HOT_LEVEL } from '../enums/hot-level';

/**
 * category: 가져오려는 음식의 category. Nullable.
userId: 사용자의 Id. Nullable.
foodLevel: 가져오려는 음식의 레벨(enum HOT_LEVEL). NOT Nullable.
size: 가져올 음식의 개수. default === 10
shuffle: 랜덤 여부. Boolean. default === true
 */
export class FindFoodsDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: '사용자 id', required: false })
  userId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '카테고리', required: false })
  category?: string;

  @IsEnum(HOT_LEVEL)
  @ApiProperty({ description: '가져오려는 음식의 맵기 레벨' })
  hotLevel: HOT_LEVEL;

  @IsNumberString()
  @IsOptional()
  @ApiProperty({ description: '가져오려는 음식의 개수', required: false })
  size: string;

  @IsBooleanString()
  @IsOptional()
  @ApiProperty({ description: '가져오려는 음식의 개수', required: false })
  shuffle: string;
}
