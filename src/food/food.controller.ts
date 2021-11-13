import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { FoodService } from './food.service';
import { Food } from './entities/food.entity';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  OmitType,
  PickType,
} from '@nestjs/swagger';
import { CreateFoodDto } from './dto/create-food.dto';
import { FindFoodsQueryDto } from './dto/find-foods-query.dto';
import { FindFoodDto, RandomFoodDto } from './dto/find-food.dto';
import { FindUserLevelFoodDto } from './dto/find-userLevel-food.dto';

@Controller('food')
@ApiTags('음식 API')
export class FoodController {
  constructor(private readonly foodService: FoodService) {
    this.foodService = foodService;
  }

  @Get()
  @ApiOperation({
    summary: '음식 리스트를 가져오는 API',
    description: '사용자 id, category가 주어질 경우 그에 맞는 음식만 가져온다.',
  })
  @ApiQuery({
    name: 'userId, category, hotLevel, sort, size',
    description: 'userId, category, hotLevel, sort, size',
    type: FindFoodsQueryDto,
  })
  @ApiResponse({ description: '음식 리스트', type: FindFoodDto })
  async findFoods(@Query() params: FindFoodsQueryDto): Promise<FindFoodDto[]> {
    return this.foodService.findFoods(params);
  }

  @Get('/reviews')
  @ApiOperation({
    summary: '리뷰할 음식 리스트를 가져오는 API',
    description: '리뷰 할 음식 List을 가져온다.',
  })
  @ApiCreatedResponse({ description: '음식 list', type: Food })
  async reviewFoodList(): Promise<Food[]> {
    return this.foodService.findReviewFoods();
  }

  @Get('/tests')
  @ApiOperation({
    summary: '테스트 음식 리스트를 가져오는 API',
    description: '테스트에 필요한 음식 리스트를 가져온다.',
  })
  @ApiCreatedResponse({ description: '음식 list', type: Food })
  async findTestFoodList(): Promise<Food[]> {
    return this.foodService.findTestFoods();
  }

  @Post()
  @ApiOperation({
    summary: '음식 정보를 저장하는 API',
    description: '새로운 음식 정보를 저장합니다.',
  })
  @ApiBody({ type: CreateFoodDto })
  @ApiCreatedResponse({ description: '등록 된 음식 정보', type: CreateFoodDto })
  async createFoodInfo(
    @Body() createFoodDto: CreateFoodDto,
  ): Promise<CreateFoodDto> {
    return this.foodService.createFoodInfo(createFoodDto);
  }

  @Get('/tests/result')
  @ApiOperation({
    summary: '사용자 레벨별 음식 추천 API',
    description: '사용자 레벨별 음식을 추천합니다.',
  })
  @ApiQuery({
    name: 'userLevel',
    type: FindUserLevelFoodDto,
    description: '사용자 레벨',
  })
  @ApiCreatedResponse({ description: '레벨별 음식 정보', type: Food })
  async findUserLevelFoods(
    @Query() param: FindUserLevelFoodDto,
  ): Promise<Food[]> {
    return this.foodService.findUserLevelFoods(param);
  }

  @Get('/random')
  @ApiOperation({
    summary: '음식 랜덤 추천 API',
    description: '음식을 랜덤 추천합니다.',
  })
  @ApiQuery({ name: 'userId', type: String, description: '사용자 ID' })
  @ApiResponse({ description: '레벨별 음식 정보', type: RandomFoodDto })
  async findRandomFood(
    @Query() param: { userId: string },
  ): Promise<RandomFoodDto> {
    return this.foodService.findRandomFoods(param.userId);
  }

  @Get(':foodId')
  @ApiOperation({
    summary: '음식id 기반으로 해당 음식의 데이터를 가져오는 API',
    description: '음식 id가 주어진다. 해당 음식의 데이터를 가져온다.',
  })
  @ApiParam({ name: '음식 id', type: String })
  @ApiResponse({
    description: '음식 리스트',
    type: PickType(FindFoodDto, ['id', 'imageUrl', 'name', 'subName']),
  })
  async findFoodByFoodId(
    @Param() param: { foodId: string },
  ): Promise<Omit<FindFoodDto, 'hotLevel'>> {
    return this.foodService.findFoodByFoodId(param.foodId);
  }
}
