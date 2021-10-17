import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLevel } from './entities/user_level.entity';
import {
  CreateUserLevelDto,
  TemporaryAnswer,
} from './dto/create-user-level.dto';
import { Food } from 'src/food/entities/food.entity';
import { EvaluateUserLevel } from './utils/evaluate-user-level';
import { GetUserLevelDto } from './dto/get-user-level.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,
  ) {}

  async createAnonymousUser(): Promise<Pick<User, 'anonymousId'>> {
    const user = new User();
    user.anonymousId = uuidv4();

    const { anonymousId } = await this.userRepository.save(user);
    return { anonymousId };
  }

  findUser(anonymousId: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userLevel', 'userLevel')
      .where('user.anonymousId = :anonymousId', { anonymousId })
      .getOne();
  }

  async createUserLevel(params: CreateUserLevelDto): Promise<GetUserLevelDto> {
    let userLevel = new UserLevel();

    const { userId, answers } = params;
    // get each food level
    const foodIds = answers.map(({ foodId }) => foodId);
    const foodsFoundByIds = await this.foodRepository
      .createQueryBuilder('food')
      .leftJoin('food.foodLevel', 'foodLevel')
      .select(['food.id', 'foodLevel.id'])
      .where('food.id IN (:...ids)', { ids: foodIds })
      .getMany();

    /**
     * Food를 받아 foodId와 foodLevelId를 객체로 하는 요소를 가지는 배열을 반환합니다.
     * @param foods Food에서 id와 foodLevel만을 발라낸 배열입니다.
     * @returns foodId와 foodLevelId의 배열을 반환합니다. {foodId, foodLevelId}[]
     */
    const generateArrayWithFoodIdAndFoodLevel = (
      foods: Pick<Food, 'id' | 'foodLevel'>[],
    ) => {
      return foods.map(({ id, foodLevel }, idx) => ({
        foodId: id,
        foodLevelId: foodLevel.id,
      }));
    };

    /**
     * foods와 answers 두 배열을 합칩니다. 동일한 foodId를 기준으로 두 배열의 각 요소는 합쳐지게 됩니다. foodId는 제외합니다.
     * @param foods foodId와 foodLeveLid로 이뤄진 배열
     * @param answers foodId와 hotLevelId로 이뤄진 배열
     * @returns foods와 answers를 겹치는 foodId를 기준으로 요소를 합친 배열 { foodLevelId, hotLevelId }
     */
    const mergeFoodsAndAnswersByFoodId = (
      foods: { foodId: string; foodLevelId: string }[],
      answers: TemporaryAnswer[],
    ) => {
      return foods.map(({ foodId, foodLevelId }) => {
        // answers에서 food와 foodId가 같은 요소를 탐색
        const matchedAnswer = answers.find(
          (answer) => answer.foodId === foodId,
        );

        // 응답(answer)에 일치하는 foodId가 있는 경우에만 반환되는 배열에 추가
        if (matchedAnswer) {
          return {
            hotLevel: matchedAnswer.hotLevel,
            foodLevelId,
          };
        }
      });
    };

    // evaluate User Level
    /**
     * foodLevelId, hotLevel로 이루어진 배열을 만듭니다
     */
    const mergedAnswersWithFoodLevel = mergeFoodsAndAnswersByFoodId(
      generateArrayWithFoodIdAndFoodLevel(foodsFoundByIds),
      answers,
    );

    const evaluateUserLevel = new EvaluateUserLevel(mergedAnswersWithFoodLevel);
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
}
