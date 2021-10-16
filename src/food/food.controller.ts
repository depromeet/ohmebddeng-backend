import { Controller, Get, Query } from '@nestjs/common';
import { FoodService } from './food.service';
import { Food } from './entities/food.entity';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@Controller('food')
@ApiTags('음식 API')
export class FoodController {
  constructor(private readonly foodService: FoodService) {
    this.foodService = foodService;
  }

  @Get('/reviews')
  @ApiOperation({
    summary: '리뷰할 음식 리스트를 가져오는 API',
    description: '리뷰 할 음식 List을 가져온다.',
  })
  @ApiQuery({ name: 'size' })
  @ApiCreatedResponse({ description: '음식 list', type: Food })
  async reviewFoodList(@Query('size') size): Promise<Food[]> {
    return this.foodService.findReviewFoods(size);
  }

  @Get('/tests')
  @ApiOperation({
    summary: '테스트 음식 리스트를 가져오는 API',
    description: '테스트에 필요한 음식 리스트를 가쟈온다.',
  })
  @ApiQuery({ name: 'size' })
  @ApiCreatedResponse({ description: '음식 list', type: Food })
  async testFoodList(@Query('size') size): Promise<Food[]> {
    return this.foodService.findTestFoods(size);
  }
}
