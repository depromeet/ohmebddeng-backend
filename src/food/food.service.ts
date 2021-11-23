import { Repository } from 'typeorm';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ERROR_MESSAGE } from '@common/enums/error-message';

import { User } from '@user/entities/user.entity';

import { produceHotLevelId } from '@review/utils/produce-hot-level';

import { CreateFoodDto } from '@food/dto/create-food.dto';
import { FindFoodDto } from '@food/dto/find-food.dto';
import { FindFoodsQueryDto } from '@food/dto/find-foods-query.dto';
import { Category } from '@food/entities/category.entity';
import { Food } from '@food/entities/food.entity';
import { FoodLevel } from '@food/entities/food_level.entity';
import { produceFindFoodDto } from '@food/utils/produceFindFoodDto';
import { sortBy } from '@food/utils/sortBy';
import { UserLevel } from '@user/entities/user_level.entity';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,

    @InjectRepository(FoodLevel)
    private readonly foodLevelRepository: Repository<FoodLevel>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.foodRepository = foodRepository;
    this.foodLevelRepository = foodLevelRepository;
    this.categoryRepository = categoryRepository;
    this.userRepository = userRepository;
  }

  async findReviewFoods(): Promise<Food> {
    return await this.foodRepository
      .createQueryBuilder('food')
      .select([
        'food.id',
        'food.name',
        'food.subName',
        'food.imageUrl',
        'food.logoImageUrl',
      ])
      .where('food.isTest = true')
      .orderBy('RAND()')
      .getOne();
  }

  async findTestFoods(): Promise<Food[]> {
    const foods: Food[] = await this.foodRepository
      .createQueryBuilder('food')
      .select([
        'food.id',
        'food.name',
        'food.subName',
        'food.imageUrl',
        'food.logoImageUrl',
      ])
      .where('food.isTest = true')
      .orderBy('RAND()')
      .getMany();

    return foods;
  }

  async findFoodLevelByLevelId(level): Promise<FoodLevel> {
    // foodLevelId을 사용하여 foodLevel 정보를 가져옴
    const foodLevel = await this.foodLevelRepository
      .createQueryBuilder('foodLevel')
      .select()
      .where('foodLevel.id = :level', { level })
      .getOne();

    return foodLevel;
  }

  async inputFood(name, subName, foodLevel) {
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

    return foodId;
  }

  async setFoodCategory(
    name,
    subName,
    level,
    category,
    foodId,
  ): Promise<CreateFoodDto> {
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

  async findFoods(
    param: FindFoodsQueryDto,
  ): Promise<Omit<FindFoodDto[], 'logoImageUrl'>> {
    try {
      const { category, hotLevel, size: providedSize, sort } = param;
      const size = providedSize ? Number(providedSize) : 10; // default size = 10

      // hotLevel 없이 요청이 온 경우
      if (!hotLevel) {
        // hotLevel 없고, category도 없는 경우
        if (!category) {
          const query = this.foodRepository.createQueryBuilder('food');

          return sortBy(query, sort)
            .take(size)
            .getMany()
            .then(produceFindFoodDto);
        }

        // hotLevel만 없는 경우
        const query = this.foodRepository
          .createQueryBuilder('food')
          .leftJoinAndSelect('food.categories', 'category')
          .where('category.name = :categoryName', { categoryName: category });

        return sortBy(query, sort)
          .take(size)
          .getMany()
          .then(produceFindFoodDto);
      }

      // hotLevel이 있는 경우
      const hotLevelId = produceHotLevelId(hotLevel);

      // hotLevel은 있지만 category가 없는 경우
      if (!category) {
        const query = this.foodRepository
          .createQueryBuilder('food')
          .leftJoinAndSelect('food.foodLevel', 'foodLevel')
          .where('foodLevel.id = :hotLevelId', { hotLevelId });

        return sortBy(query, sort)
          .take(size)
          .getMany()
          .then(produceFindFoodDto);
      }
      const query = this.foodRepository
        .createQueryBuilder('food')
        .leftJoinAndSelect('food.categories', 'category')
        .leftJoinAndSelect('food.foodLevel', 'foodLevel')
        .where('category.name = :categoryName', { categoryName: category })
        .andWhere('foodLevel.id = :hotLevelId', { hotLevelId });

      return sortBy(query, sort).take(size).getMany().then(produceFindFoodDto);
    } catch (e) {
      throw new HttpException(ERROR_MESSAGE.NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
  }

  // 레벨 별 음식 정보를 가져 옵니다.
  async findUserLevelFoods(userLevel): Promise<FoodLevel> {
    const foodLevel = await this.foodLevelRepository
      .createQueryBuilder('foodLevel')
      .leftJoinAndSelect('foodLevel.userLevel', 'userLevel')
      .where('foodLevel.userLevel = :userLevel', { userLevel })
      .getOne();

    return foodLevel;
  }

  async findTreeFood(foodLevel): Promise<Food[]> {
    const foods: Food[] = await this.foodRepository
      .createQueryBuilder('food')
      .leftJoinAndSelect('food.foodLevel', 'foodLevel')
      .select(['food.id', 'food.name', 'food.subName', 'food.imageUrl'])
      .where('food.foodLevel = :foodLevel', { foodLevel })
      .orderBy('RAND()')
      .limit(3)
      .getMany();
    return foods;
  }

  async findUserLevel(userId): Promise<UserLevel> {
    const { userLevel: userlevel } = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userLevel', 'userLevel')
      .select()
      .where('user.id = :userId', { userId })
      .getOne();
    return userlevel;
  }

  async findFoodByUserLevel(userlevel): Promise<Food> {
    const food = await this.foodRepository
      .createQueryBuilder('food')
      .leftJoinAndSelect('food.foodLevel', 'foodLevel')
      .select([
        'food.id',
        'food.name',
        'food.subName',
        'food.imageUrl',
        'food.logoImageUrl',
      ])
      .where('food.foodLevel = :foodLevel', { foodLevel: userlevel.id })
      .orderBy('RAND()')
      .getOne();
    return food;
  }

  async findFoodByFoodId(
    foodId: string,
  ): Promise<Omit<FindFoodDto, 'hotLevel'>> {
    const food = this.foodRepository
      .createQueryBuilder('food')
      .select([
        'food.id',
        'food.name',
        'food.subName',
        'food.imageUrl',
        'food.logoImageUrl',
      ])
      .where('food.id = :foodId', { foodId })
      .getOne();
    return food;
  }
}
