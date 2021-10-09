import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { uuidValidateV4 } from './utils/uuid-validate-v4';
import { v4 as uuidv4 } from 'uuid';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

class MockRepository {
  async save(user: User) {
    return user;
  }
}

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockFn = async () => {
    const anonymousId = uuidv4();
    return { anonymousId };
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: MockRepository,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  describe('getAnonymousId', () => {
    it('should be defined', () => {
      expect(controller.getAnonymousId).toBeDefined();
    });

    it('should return a valid uuidv4', async () => {
      jest.spyOn(service, 'createAnonymousUser').mockImplementation(mockFn);

      const { anonymousId } = await controller.getAnonymousId();
      expect(uuidValidateV4(anonymousId)).toBe(true);
    });
  });

  describe('getUser', () => {
    it('should be defined', () => {
      expect(controller.getUser).toBeDefined();
    });

    it.todo('should return matched user');
  });
});
