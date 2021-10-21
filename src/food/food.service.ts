import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
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

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {
    this.foodRepository = foodRepository;
    this.foodLevelRepository = foodLevelRepository;
    this.categoryRepository = categoryRepository;
  }

  async findReviewFoods(size): Promise<Food[]> {
    const foodList = await this.foodRepository.find(size);
    return foodList;
  }

  async findTestFoods(size): Promise<Food[]> {
    return await this.foodRepository.find(size);
  }

  async createFoodInfo(foodDetail: CreateFoodDto): Promise<CreateFoodDto> {
    const { name, level, category } = foodDetail;

    // foodLevelId을 사용하여 foodLevel 정보를 가져옴
    const foodLevel = await this.foodLevelRepository
      .createQueryBuilder('foodLevel')
      .select()
      .where('foodLevel.id = :level', { level })
      .getOne();

    // food 값 넣기
    const foodInfo = await this.foodRepository
      .createQueryBuilder('food')
      .leftJoin('food.foodLevel', 'foodLevel')
      .insert()
      .into(Food)
      .values([{ name, foodLevel }])
      .execute()
      .then((food) => {
        const foodId = food.identifiers[0].id;

        return this.foodRepository
          .createQueryBuilder('food')
          .select()
          .where('food.id = :foodId', { foodId })
          .getOne();
      });

    //음식의 카테고리를 설정하기 위해서 categoryId값을 가져옴
    const categoryInfo = await this.categoryRepository
      .createQueryBuilder('category')
      .select()
      .where('category.name = :category', { category })
      .getOne();

    // console.log(categoryInfo);

    // ManyToMany관계 -> 음식 카테고리 지정
    await this.foodRepository
      .createQueryBuilder('food_category')
      .relation(Food, 'categories')
      .of(foodInfo)
      .add(categoryInfo);

    return {
      name: name,
      level: level,
      category: category,
    };
  }
}
