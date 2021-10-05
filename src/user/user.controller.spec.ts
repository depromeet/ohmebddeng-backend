import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { uuidValidateV4 } from './utils/uuid-validate-v4';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  describe('getAnonymousId', () => {
    it('should return a valid uuidv4', async () => {
      const { anonymousId } = await controller.getAnonymousId();
      expect(uuidValidateV4(anonymousId)).toBe(true);
    });
  });
});
