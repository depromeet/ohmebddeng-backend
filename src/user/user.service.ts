import { Injectable } from '@nestjs/common';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
}
