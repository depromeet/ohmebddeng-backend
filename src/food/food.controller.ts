import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HttpException, HttpStatus } from '@nestjs/common';

import { ERROR_MESSAGE } from '@common/enums/error-message';

import { FoodService } from '@food/food.service';
import { Food } from '@food/entities/food.entity';
import { CreateFoodDto } from '@food/dto/create-food.dto';
import { FindFoodsQueryDto } from '@food/dto/find-foods-query.dto';
import {
  FindFoodDto,
  FindFoodInfoDto,
  RandomFoodDto,
} from '@food/dto/find-food.dto';
import { FindUserLevelFoodDto } from '@food/dto/find-userLevel-food.dto';
import { FindUserLevelByUserIdDto } from '@user/dto/find-user-level.dto';

@Controller('food')
@ApiTags('음식 API')
export class FoodController {
  constructor(private readonly foodService: FoodService) {
    this.foodService = foodService;
  }

  @Get()
  @ApiOperation({ summary: '음식 리스트를 가져오는 API' })
  async findFoods(@Query() params: FindFoodsQueryDto): Promise<FindFoodDto[]> {
    return this.foodService.findFoods(params);
  }

  @Get('/reviews')
  @ApiOperation({ summary: '리뷰할 음식 리스트를 가져오는 API' })
  async reviewFoodList(): Promise<Food> {
    try {
      return this.foodService.findReviewFoods();
    } catch (e) {
      throw new HttpException(ERROR_MESSAGE.NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/tests')
  @ApiOperation({ summary: '테스트 음식 리스트를 가져오는 API' })
  async findTestFoodList(): Promise<Food[]> {
    try {
      return this.foodService.findTestFoods();
    } catch (e) {
      throw new HttpException(ERROR_MESSAGE.NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  @ApiOperation({ summary: '음식 정보를 저장하는 API' })
  async createFoodInfo(
    @Body() createFoodDto: CreateFoodDto,
  ): Promise<CreateFoodDto> {
    const { name, subName, level, category } = createFoodDto;
    try {
      const foodLevel = await this.foodService.findFoodLevelByLevelId(level);
      const foodId = await this.foodService.inputFood(name, subName, foodLevel);
      return this.foodService.setFoodCategory(
        name,
        subName,
        level,
        category,
        foodId,
      );
    } catch (e) {
      throw new HttpException(ERROR_MESSAGE.NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/tests/result')
  @ApiOperation({ summary: '사용자 레벨별 음식 추천 API' })
  async findUserLevelFoods(
    @Query() param: FindUserLevelFoodDto,
  ): Promise<Food[]> {
    const { userLevel } = param;
    try {
      const { id: foodLevel } = await this.foodService.findUserLevelFoods(
        userLevel,
      );
      return this.foodService.findTreeFood(foodLevel);
    } catch (e) {
      throw new HttpException(ERROR_MESSAGE.NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/random')
  @ApiOperation({ summary: '음식 랜덤 추천 API' })
  async findRandomFood(
    @Query() param: FindUserLevelByUserIdDto,
  ): Promise<RandomFoodDto> {
    const { userId } = param;
    try {
      const userlevel = await this.foodService.findUserLevel(userId);

      if (userlevel.id === '5') userlevel.id = '4';

      return await this.foodService.findFoodByUserLevel(userlevel);
    } catch (e) {
      throw new HttpException(ERROR_MESSAGE.NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':foodId')
  @ApiOperation({ summary: '음식id로 음식 정보를 가져오는 API' })
  async findFoodByFoodId(
    @Param() param: FindFoodInfoDto,
  ): Promise<Omit<FindFoodDto, 'hotLevel'>> {
    const { foodId } = param;
    try {
      return this.foodService
        .findFoodByFoodId(foodId)
        .then(({ id, name, subName, imageUrl, logoImageUrl }) => ({
          id,
          name,
          subName,
          imageUrl,
          logoImageUrl,
        }));
    } catch (e) {
      throw new HttpException(ERROR_MESSAGE.NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
  }
}
