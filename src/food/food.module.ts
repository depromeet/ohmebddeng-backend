import { Module } from '@nestjs/common';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';

@Module({
  controllers: [FoodController],
  providers: [FoodService]
})
export class FoodModule {}
