import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLevel } from './entities/user_level.entity';
import {
  updateUserLevelDto,
  TemporaryAnswer,
} from './dto/create-user-level.dto';
import { Food } from 'src/food/entities/food.entity';
import { EvaluateUserLevel } from './utils/evaluate-user-level';
import { FindUserLevelDto } from './dto/find-user-level.dto';

interface IFoodLevel {
  foodId: string;
  foodLevelId: string;
}
import { FindAnonymousUserDto } from './dto/find-anonymous-user.dto';
import { FindUserCountDto } from './dto/find-user-count.dto';
import { FindUserCountQueryDto } from './dto/find-user-count-query.dto';
import { FindUserDto } from './dto/find-user.dto';
import { TransformDao } from './utils/transform.dao';
import { TransformDto } from './utils/transform.dto';
import { ERROR_MESSAGE } from '@common/enums/error-message';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,

    private readonly transformDao: TransformDao,
    private readonly transformDto: TransformDto,
  ) {}

  async createAnonymousUser(): Promise<FindAnonymousUserDto> {
    const user = new User();
    user.anonymousId = uuidv4();

    const { anonymousId, id: userId } = await this.userRepository.save(user);
    return { anonymousId, userId };
  }
  /**
   * 사용자 id를 기반으로 해당 사용자의 정보를 가져오는 API
   * @param userId 사용자 id를 param으로 받음
   * @returns 사용자 정보, 사용자 레벨 정보, 사용자의 리뷰 정보
   */
  async findUser(
    userId: string,
  ): Promise<FindUserDto | Omit<FindUserDto, 'userLevel'>> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userLevel', 'userLevel')
      .leftJoinAndSelect('userLevel.userLevelDetail', 'userLevelDetail')
      .where('user.id = :userId', { userId })
      .getOne();

    return this.transformDao.findUser(user);
  }

  async updateUserLevel(params: updateUserLevelDto): Promise<FindUserLevelDto> {
    let userLevel = new UserLevel();

    let { userId, answers } = params;

    // foodId 값이 없는 응답은 걸러냄. 응답이 존재하지 않을 경우 에러 발생시킴
    const foodIds = answers
      .filter((answer) => answer.foodId)
      .map((food) => {
        if (!food || !food.foodId) {
          throw new HttpException(
            ERROR_MESSAGE.BAD_REQUEST,
            HttpStatus.BAD_REQUEST,
          );
        }

        return food.foodId;
      });

    // 각 음식별로 음식레벨을 가져옴
    const foods = await this.foodRepository
      .createQueryBuilder('food')
      .leftJoin('food.foodLevel', 'foodLevel')
      .select(['food.id', 'foodLevel.id'])
      .where('food.id IN (:...ids)', { ids: foodIds })
      .getMany();

    // 사용자의 레벨을 알고리즘에 의해 결정함
    const evaluateParam = this.transformDto.updateUserLevel(foods, answers);
    const evaluateUserLevel = new EvaluateUserLevel(evaluateParam);
    userLevel.id = evaluateUserLevel.evaluateLevel().toString();

    // 사용자의 레벨을 DB에 저장함
    this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ userLevel })
      .where('id = :id', { id: userId })
      .execute();

    // 저장된 사용자 레벨과 정보를 DB에서 가져옴
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.userLevel', 'userLevel')
      .select(['user.id', 'userLevel'])
      .where('user.id = :id', { id: userId })
      .getOne();

    return this.transformDao.updateUserLevel(user);
  }

  async findUserCount(param: FindUserCountQueryDto): Promise<FindUserCountDto> {
    // query param이라 string으로만 받아짐.
    const levelTestedOnly = param.levelTestedOnly === 'true';

    if (levelTestedOnly) {
      return this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.userLevel', 'userLevel')
        .where('userLevel.id IS NOT NULL')
        .getCount()
        .then((count) => ({
          count,
          levelTestedOnly,
        }));
    }

    return this.userRepository
      .createQueryBuilder('user')
      .getCount()
      .then((count) => ({
        count,
        levelTestedOnly,
      }));
  }
}
