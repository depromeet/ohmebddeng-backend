import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFoodDto } from './dto/create-food.dto';
import { Category } from './entities/category.entity';
import { Food } from './entities/food.entity';
import { FoodLevel } from './entities/food_level.entity';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,

    @InjectRepository(FoodLevel)
    private foodLevelRepository: Repository<FoodLevel>,
  ) {
    this.foodRepository = foodRepository;
    this.foodLevelRepository = foodLevelRepository;
  }

  async findReviewFoods(size): Promise<Food[]> {
    const foodList = await this.foodRepository.find(size);
    return foodList;
  }

  async findTestFoods(size): Promise<Food[]> {
    return await this.foodRepository.find(size);
  }

  async createFoodInfo(foodDetail: CreateFoodDto): Promise<CreateFoodDto> {
    const { name, level } = foodDetail;

    // foodLevelId을 사용하여 foodLevel 정보를 가져옴
    const foodLevel = await this.foodLevelRepository
      .createQueryBuilder('foodLevel')
      .select()
      .where('foodLevel.id = :level', { level })
      .getOne();

    this.foodRepository
      .createQueryBuilder('food')
      .leftJoin('food.foodLevel', 'foodLevel')
      .insert()
      .into(Food)
      .values([{ name, foodLevel }])
      .execute();

    return {
      name: name,
      level: level,
    };
  }
}
