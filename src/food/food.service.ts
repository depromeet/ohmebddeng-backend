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
    private readonly foodLevelRepository: Repository<FoodLevel>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {
    this.foodRepository = foodRepository;
    this.foodLevelRepository = foodLevelRepository;
    this.categoryRepository = categoryRepository;
  }

  async findReviewFoods(size): Promise<Food[]> {
    const foodList = await this.foodRepository.find(size);
    return foodList;
  }

  async findTestFoods(): Promise<Food[]> {
    return await this.foodRepository
      .createQueryBuilder('food')
      .select(['food.id', 'food.name', 'food.subName', 'food.imageUrl'])
      .where('food.isTest = true')
      .getMany();
  }

  async createFoodInfo(foodDetail: CreateFoodDto): Promise<CreateFoodDto> {
    const { name, subName, level, category } = foodDetail;

    // foodLevelId을 사용하여 foodLevel 정보를 가져옴
    const foodLevel = await this.foodLevelRepository
      .createQueryBuilder('foodLevel')
      .select()
      .where('foodLevel.id = :level', { level })
      .getOne();

    // food 값 넣기
    const { id: foodId } = await this.foodRepository
      .createQueryBuilder('food')
      .leftJoin('food.foodLevel', 'foodLevel')
      .insert()
      .into(Food)
      .values({ name, subName, foodLevel })
      .execute()
      .then(({ identifiers }) => {
        if (identifiers.length !== 1) {
          // 하나의 음식만 추가하였으므로, 반드시 identifiers 길이는 반드시 1
          throw new Error();
        }
        return identifiers.pop();
      });

    //음식의 카테고리를 설정하기 위해서 categoryId값을 가져옴
    const { id: categoryId } = await this.categoryRepository
      .createQueryBuilder('category')
      .select(['category.id'])
      .where('category.name = :category', { category })
      .getOne();

    // ManyToMany관계 -> 음식 카테고리 지정
    await this.foodRepository
      .createQueryBuilder('food_category')
      .relation(Food, 'categories')
      .of(foodId)
      .add(categoryId);

    return {
      name,
      subName,
      level,
      category,
    };
  }
}
