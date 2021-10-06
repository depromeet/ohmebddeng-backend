import { PartialType } from '@nestjs/swagger';
import { CreateRestaurantDto } from './create-restaurant.dto';

export class UpdateFoodDto extends PartialType(CreateRestaurantDto) {}
