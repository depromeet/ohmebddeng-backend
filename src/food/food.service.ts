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
    return this.foodRepository
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
    return this.foodRepository
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
  }

  async findFoodLevelByLevelId(level): Promise<FoodLevel> {
    // foodLevelId??? ???????????? foodLevel ????????? ?????????
    return this.foodLevelRepository
      .createQueryBuilder('foodLevel')
      .select()
      .where('foodLevel.id = :level', { level })
      .getOne();
  }

  async inputFood(name, subName, foodLevel) {
    // food ??? ??????
    const { id: foodId } = await this.foodRepository
      .createQueryBuilder('food')
      .leftJoin('food.foodLevel', 'foodLevel')
      .insert()
      .into(Food)
      .values({ name, subName, foodLevel })
      .execute()
      .then(({ identifiers }) => {
        if (identifiers.length !== 1) {
          // ????????? ????????? ?????????????????????, ????????? identifiers ????????? ????????? 1
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
    //????????? ??????????????? ???????????? ????????? categoryId?????? ?????????
    const { id: categoryId } = await this.categoryRepository
      .createQueryBuilder('category')
      .select(['category.id'])
      .where('category.name = :category', { category })
      .getOne();

    // ManyToMany?????? -> ?????? ???????????? ??????
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

      // hotLevel ?????? ????????? ??? ??????
      if (!hotLevel) {
        // hotLevel ??????, category??? ?????? ??????
        if (!category) {
          const query = this.foodRepository
            .createQueryBuilder('food')
            .where('food.imageUrl is not null');

          return sortBy(query, sort)
            .take(size)
            .getMany()
            .then(produceFindFoodDto);
        }

        // hotLevel??? ?????? ??????
        const query = this.foodRepository
          .createQueryBuilder('food')
          .leftJoinAndSelect('food.categories', 'category')
          .where('category.name = :categoryName', { categoryName: category })
          .andWhere('food.imageUrl is not null');

        return sortBy(query, sort)
          .take(size)
          .getMany()
          .then(produceFindFoodDto);
      }

      // hotLevel??? ?????? ??????
      const hotLevelId = produceHotLevelId(hotLevel);

      // hotLevel??? ????????? category??? ?????? ??????
      if (!category) {
        const query = this.foodRepository
          .createQueryBuilder('food')
          .leftJoinAndSelect('food.foodLevel', 'foodLevel')
          .where('foodLevel.id = :hotLevelId', { hotLevelId })
          .andWhere('food.imageUrl is not null');

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
        .andWhere('foodLevel.id = :hotLevelId', { hotLevelId })
        .andWhere('food.imageUrl is not null');

      return sortBy(query, sort).take(size).getMany().then(produceFindFoodDto);
    } catch (e) {
      throw new HttpException(ERROR_MESSAGE.NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
  }

  // ?????? ??? ?????? ????????? ?????? ?????????.
  async findUserLevelFoods(userLevel): Promise<FoodLevel> {
    return this.foodLevelRepository
      .createQueryBuilder('foodLevel')
      .leftJoinAndSelect('foodLevel.userLevel', 'userLevel')
      .where('foodLevel.userLevel = :userLevel', { userLevel })
      .getOne();
  }

  async findTreeFood(foodLevel): Promise<Food[]> {
    return this.foodRepository
      .createQueryBuilder('food')
      .leftJoinAndSelect('food.foodLevel', 'foodLevel')
      .select(['food.id', 'food.name', 'food.subName', 'food.imageUrl'])
      .where('food.foodLevel = :foodLevel', { foodLevel })
      .orderBy('RAND()')
      .limit(3)
      .getMany();
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
    return this.foodRepository
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
  }

  async findFoodByFoodId(
    foodId: string,
  ): Promise<Omit<FindFoodDto, 'hotLevel'>> {
    return this.foodRepository
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
  }
}
