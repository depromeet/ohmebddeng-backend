import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Restaurant } from '../entities/restaurant.entity';
@ApiExtraModels(Restaurant)
export class CreateRestaurantDto {
  @IsString()
  @ApiProperty({ description: '음식점 이름', type: String })
  name: string;
}
