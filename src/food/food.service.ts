import { Repository } from 'typeorm';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ERROR_MESSAGE } from '@common/enums/error-message';

import { User } from '@user/entities/user.entity';

import { produceHotLevelId } from '@review/utils/produce-hot-level';

import { CreateFoodDto } from '@food/dto/create-food.dto';
import { FindFoodDto, RandomFoodDto } from '@food/dto/find-food.dto';
import { FindFoodsQueryDto } from '@food/dto/find-foods-query.dto';
import { Category } from '@food/entities/category.entity';
import { Food } from '@food/entities/food.entity';
import { FoodLevel } from '@food/entities/food_level.entity';
import { produceFindFoodDto } from '@food/utils/produceFindFoodDto';
import { sortBy } from '@food/utils/sortBy';

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

  async findReviewFoods(): Promise<Food[]> {
    try {
      const foods: Food[] = await this.foodRepository
        .createQueryBuilder('food')
        .select(['food.id', 'food.name', 'food.subName', 'food.imageUrl','food.logoImageUrl'])
        .where('food.isTest = true')
        .orderBy('RAND()')
        .limit(3)
        .getMany();

      return foods;
    } catch (e) {
      throw new HttpException(ERROR_MESSAGE.NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
  }

  async findTestFoods(): Promise<Food[]> {
    try {
      const foods: Food[] = await this.foodRepository
        .createQueryBuilder('food')
        .select(['food.id', 'food.name', 'food.subName', 'food.imageUrl','food.logoImageUrl'])
        .where('food.isTest = true')
        .orderBy('RAND()')
        .getMany();

      return foods;
    } catch (e) {
      throw new HttpException(ERROR_MESSAGE.NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
  }

  async createFoodInfo(foodDetail: CreateFoodDto): Promise<CreateFoodDto> {
    try {
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
        })
        .catch((e) => {
          console.log(e);
          throw new HttpException(
            ERROR_MESSAGE.BAD_REQUEST,
            HttpStatus.BAD_REQUEST,
          );
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
    } catch (e) {
      throw new HttpException(ERROR_MESSAGE.NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 음식 리스트를 가져옵니다. userId가 주어지면 user의 맵레벨에 맞는 음식들만 필터해 가져옵니다.
   * category가 주어지면 category에 해당하는 음식들만 필터해 가져옵니다.
   * userId와 category는 Optional하게 주거나 안 줄 수 있습니다.
   * 경우에 따라서 user의 맵레벨과 상관없이 특정 카테고리의 모든 음식만 가져오는 API가 필요할 수도 있고,
   * 전체 음식 리스트를 가져오고 싶은 경우도 있을 수 있기 때문입니다.
   * @param param userId?: string, category?: string, size?: string, sort?: SORT, hotLevel?: HOT_LEVEL
   * @returns id, name, subName, imageUrl, logoImageUrl, hotLevel로 이루어진 객체의 배열
   */
  async findFoods(param: FindFoodsQueryDto): Promise<Omit<FindFoodDto[], 'logoImageUrl'>> {
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
  async findUserLevelFoods(param): Promise<Food[]> {
    try {
      const { userLevel } = param;

      const { id: foodLevel } = await this.foodLevelRepository
        .createQueryBuilder('foodLevel')
        .leftJoinAndSelect('foodLevel.userLevel', 'userLevel')
        .where('foodLevel.userLevel = :userLevel', { userLevel })
        .getOne();

      const foods: Food[] = await this.foodRepository
        .createQueryBuilder('food')
        .leftJoinAndSelect('food.foodLevel', 'foodLevel')
        .select(['food.id', 'food.name', 'food.subName', 'food.imageUrl'])
        .where('food.foodLevel = :foodLevel', { foodLevel })
        .orderBy('RAND()')
        .limit(3)
        .getMany();
      return foods;
    } catch (e) {
      throw new HttpException(ERROR_MESSAGE.NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
<<<<<<< HEAD
=======

    const { id: foodLevel } = await this.foodLevelRepository
      .createQueryBuilder('foodLevel')
      .leftJoinAndSelect('foodLevel.userLevel', 'userLevel')
      .where('foodLevel.userLevel = :userLevel', { userLevel })
      .getOne();

    return await this.foodRepository
      .createQueryBuilder('food')
      .leftJoinAndSelect('food.foodLevel', 'foodLevel')
      .select([
        'food.id',
        'food.name',
        'food.subName',
        'food.imageUrl',
        'food.logoImageUrl',
      ])
      .where('food.foodLevel = :foodLevel', { foodLevel })
      .orderBy('RAND()')
      .limit(3)
      .getMany();
>>>>>>> dev
  }

  async findRandomFoods(userId): Promise<RandomFoodDto> {
    try {
      const { userLevel: userlevel } = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.userLevel', 'userLevel')
        .select()
        .where('user.id = :userId', { userId })
        .getOne();

      if (userlevel.id === '5') {
        userlevel.id = '4';
      }

      const food: RandomFoodDto = await this.foodRepository
        .createQueryBuilder('food')
        .leftJoinAndSelect('food.foodLevel', 'foodLevel')
        .select(['food.id', 'food.name', 'food.subName', 'food.imageUrl'])
        .where('food.foodLevel = :foodLevel', { foodLevel: userlevel.id })
        .orderBy('RAND()')
        .getOne();
      return food;
    } catch (e) {
      throw new HttpException(ERROR_MESSAGE.NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
<<<<<<< HEAD
=======

    return await this.foodRepository
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
>>>>>>> dev
  }

  async findFoodByFoodId(
    foodId: string,
  ): Promise<Omit<FindFoodDto, 'hotLevel'>> {
<<<<<<< HEAD
    try {
      const food = this.foodRepository
        .createQueryBuilder('food')
        .select(['food.id', 'food.name', 'food.subName', 'food.imageUrl'])
        .where('food.id = :foodId', { foodId })
        .getOne()
        .then(({ id, name, subName, imageUrl }) => ({
          id,
          name,
          subName,
          imageUrl,
        }));
      return food;
    } catch (e) {
      throw new HttpException(ERROR_MESSAGE.NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
=======
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
      .getOne()
      .then(({ id, name, subName, imageUrl, logoImageUrl }) => ({
        id,
        name,
        subName,
        imageUrl,
        logoImageUrl,
      }));
>>>>>>> dev
  }
}
