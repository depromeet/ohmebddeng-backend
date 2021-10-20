import { Injectable } from '@nestjs/common';
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
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,
  ) {}

  async createAnonymousUser(): Promise<FindAnonymousUserDto> {
    const user = new User();
    user.anonymousId = uuidv4();

    const { anonymousId, id: userId } = await this.userRepository.save(user);
    return { anonymousId, userId };
  }

  findUser(userId: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userLevel', 'userLevel')
      .where('user.id = :userId', { userId })
      .getOne();
  }

  async updateUserLevel(params: updateUserLevelDto): Promise<FindUserLevelDto> {
    let userLevel = new UserLevel();

    const { userId, answers } = params;

    // get each food level
    const foodIds = answers.map(({ foodId }) => foodId);
    const foods: IFoodLevel[] = await this.foodRepository
      .createQueryBuilder('food')
      .leftJoin('food.foodLevel', 'foodLevel')
      .select(['food.id', 'foodLevel.id'])
      .where('food.id IN (:...ids)', { ids: foodIds })
      .getMany()
      .then((foods) =>
        foods.map(({ id: foodId, foodLevel }) => ({
          //foodId, foodLevelId만 뽑아낸다.
          foodId,
          foodLevelId: foodLevel.id,
        })),
      );

    /**
     * EvaluateLevel에 필요한 형태로 foods와 answers 두 배열을 가공합니다.
     * foods와 answers 두 배열을 합칩니다. 동일한 foodId를 기준으로 두 배열의 각 요소는 합쳐지게 됩니다. foodId는 제외합니다.
     * @param foods foodId와 foodLeveLid로 이뤄진 배열
     * @param answers foodId와 hotLevelId로 이뤄진 배열
     * @returns foods와 answers를 겹치는 foodId를 기준으로 요소를 합친 배열 { foodLevelId, hotLevelId }
     */
    const createEvaluateUserLevelParam = (
      foods: IFoodLevel[],
      answers: TemporaryAnswer[],
    ) => {
      return foods.map(({ foodId, foodLevelId }) => {
        // answers에서 food와 foodId가 같은 요소를 탐색
        const { hotLevel } = answers.find((answer) => answer.foodId === foodId);

        // 응답(answer)에 일치하는 foodId가 있는 경우만 hotLevel과 foodLevelId를 반환되는 배열에 추가
        return hotLevel && { hotLevel, foodLevelId };
      });
    };

    // evaluate User Level
    /**
     * foodLevelId, hotLevel로 이루어진 배열을 만듭니다
     */
    const evaluateUserLevelParams = createEvaluateUserLevelParam(
      foods,
      answers,
    );

    const evaluateUserLevel = new EvaluateUserLevel(evaluateUserLevelParams);
    userLevel.id = evaluateUserLevel.evaluateLevel().toString();

    // save userLevel in DB
    this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ userLevel })
      .where('id = :id', { id: userId })
      .execute();

    // // return userLevel
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.userLevel', 'userLevel')
      .select(['user.id', 'userLevel'])
      .where('user.id = :id', { id: userId })
      .getOne()
      .then(({ id: userId, userLevel }) => ({ userId, userLevel }));
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
