import { Controller, Get } from '@nestjs/common';
import { FoodService } from './food.service';
import { Food } from './entities/food.entity';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {
    this.foodService = foodService;
  }

  @Get('/reviews')
  async reviewFoodList(): Promise<Food[]> {
    return this.foodService.findReviewFoods();
  }

  @Get('/tests')
  async testFoodList(): Promise<Food[]> {
    return this.foodService.findTestFoods();
  }
}
