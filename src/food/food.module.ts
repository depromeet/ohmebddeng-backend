import { Module } from '@nestjs/common';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Food } from './entities/food.entity';
import { Restaurant } from './entities/restaurant.entity';
import { FoodLevel } from './entities/food_level.entity';
import { Category } from './entities/category.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Food, Restaurant, FoodLevel, Category, User]),
  ],
  controllers: [FoodController],
  providers: [FoodService],
})
export class FoodModule {}
