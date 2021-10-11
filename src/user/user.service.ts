import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLevel } from './entities/user_level.entity';
import { CreateReviewDto } from 'src/review/dto/create-review.dto';
import { evaluateUserLevel } from './utils/evaluate-user-level';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  createUserLevel(params: CreateReviewDto): Promise<Pick<User, 'userLevel'>> {
    let userLevel: UserLevel;

    // create review: Call reviewService.save()

    // evaluate User Level
    userLevel = evaluateUserLevel(params);

    // save userLevel in DB
    this.userRepository
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({ userLevel })
      .execute();

    // return userLevel
    return this.userRepository
      .createQueryBuilder('user')
      .select(['user.userLevel'])
      .getOne();
  }
}
