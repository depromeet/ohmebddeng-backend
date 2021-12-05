import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateFoodRequestDto {
  @IsString()
  @ApiProperty({ description: '추가를 원하는 음식명' })
  food: string;
}
