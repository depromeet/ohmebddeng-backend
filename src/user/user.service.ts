import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLevel } from './entities/user_level.entity';
import { Food } from 'src/food/entities/food.entity';
import { EvaluateUserLevel } from './utils/evaluate-user-level';
import { Answer } from './dto/create-user-level.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,

    private readonly evaluateUserLevel: EvaluateUserLevel,
  ) {}

  /**
   * 익명 사용자 생성 API
   * @returns 생성된 사용자의 userId, anonymousId
   */
  async createAnonymousUser(): Promise<User> {
    const user = new User();
    user.anonymousId = uuidv4();

    return this.userRepository.save(user);
  }

  /**
   * 사용자 id를 기반으로 해당 사용자의 정보를 가져오는 API
   * @param userId 사용자 id를 param으로 받음
   * @returns 사용자 정보, 사용자 레벨 정보, 사용자의 리뷰 정보
   */
  async findUser(userId: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userLevel', 'userLevel')
      .leftJoinAndSelect('userLevel.userLevelDetail', 'userLevelDetail')
      .where('user.id = :userId', { userId })
      .getOne();
  }

  /**
   * 사용자의 레벨을 결정합니다(create/update)
   * @param userId 사용자 ID
   * @param answers {음식 ID, 맵레벨평가}
   * @param foodIds 평가한 음식 ID로 이루어진 배열
   * @returns 사용자의 레벨을 포함한 사용자 정보
   */
  async updateUserLevel(
    userId: string,
    answers: Answer[],
    foodIds: string[],
  ): Promise<User> {
    let userLevel = new UserLevel();

    // 각 음식별로 음식레벨을 가져옴
    const foods = await this.foodRepository
      .createQueryBuilder('food')
      .leftJoin('food.foodLevel', 'foodLevel')
      .select(['food.id', 'foodLevel.id'])
      .where('food.id IN (:...ids)', { ids: foodIds })
      .getMany();

    // 사용자의 레벨을 알고리즘에 의해 결정함
    userLevel.id = this.evaluateUserLevel
      .evaluateLevel(foods, answers)
      .toString();

    // 사용자의 레벨을 DB에 저장함
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ userLevel })
      .where('id = :id', { id: userId })
      .execute();

    // 저장된 사용자 레벨과 정보를 DB에서 가져옴
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.userLevel', 'userLevel')
      .select(['user.id', 'userLevel'])
      .where('user.id = :id', { id: userId })
      .getOne();
  }

  /**
   * 총 사용자 수/레벨테스트를 한 총 사용자 수를 가져오는 API
   * @param levelTestedOnly boolean. 레벨테스트를 한 사용자만 가져오고 싶은 경우.
   * @returns 사용자 수(number)
   */
  async findUserCount(levelTestedOnly: boolean): Promise<number> {
    const query = this.userRepository.createQueryBuilder('user');
    if (levelTestedOnly) {
      return query
        .leftJoinAndSelect('user.userLevel', 'userLevel')
        .where('userLevel.id IS NOT NULL')
        .getCount();
    }

    return query.getCount();
  }
}
