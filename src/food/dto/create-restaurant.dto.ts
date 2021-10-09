import { IsBoolean, IsNumber, IsString, IsDate } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  name: string;
}
