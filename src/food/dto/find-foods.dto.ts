import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindFoodsDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: '사용자 id', required: false })
  userId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '카테고리', required: false })
  category?: string;
}
