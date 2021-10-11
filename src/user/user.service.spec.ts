import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { uuidValidateV4 } from './utils/uuid-validate-v4';
class MockRepository {
  async save(user: User) {
    return user;
  }
}

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: MockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('createAnonymousUser', () => {
    it('should be defined', () => {
      expect(service.createAnonymousUser).toBeDefined();
    });

    it('shoud not throw any error', async () => {
      expect(service.createAnonymousUser).not.toThrow();
    });

    it('should return a valid uuidv4', async () => {
      const result = await service.createAnonymousUser();
      expect(uuidValidateV4(result.anonymousId)).toBe(true);
    });
  });

  describe('findUser', () => {
    it('should be defined', () => {
      expect(service.findUser).toBeDefined();
    });

    it.todo('shoud not throw any error');

    it.todo('should return a matched user');
  });

  describe('createUserLevel', () => {
    it.todo('should calculate proper user level');
  });
});
