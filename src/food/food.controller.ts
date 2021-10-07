import { Controller, Get, Query } from '@nestjs/common';
import { FoodService } from './food.service';
import { Food } from './entities/food.entity';

@Controller('food')
export class FoodController {
  constructor(private readonly foodService: FoodService) {
    this.foodService = foodService;
  }

  @Get('/reviews')
  async reviewFoodList(@Query('size') size): Promise<Food[]> {
    return this.foodService.findReviewFoods(size);
  }

  @Get('/tests')
  async testFoodList(@Query('size') size): Promise<Food[]> {
    return this.foodService.findTestFoods(size);
  }
}
