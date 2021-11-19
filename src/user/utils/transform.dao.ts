import { ERROR_MESSAGE } from '@common/enums/error-message';
import { HttpException, HttpStatus } from '@nestjs/common';
import { User } from '@user/entities/user.entity';
export class TransformDao {
  findUser(user: User) {
    try {
      const { userLevel, isDeleted, role, ...userRest } = user;

      // Level이 없는 경우 일반 user 값만 return
      if (!userLevel) {
        return userRest;
      }

      const {
        id,
        name,
        imageUrl,
        summary,
        description,
        userLevelDetail,
        level,
      } = userLevel;
      const details = userLevelDetail.map(({ detail }) => detail);

      return {
        ...userRest,
        userLevel: {
          id,
          name,
          imageUrl,
          summary,
          description,
          details,
          level,
        },
      };
    } catch (e) {
      throw new HttpException(ERROR_MESSAGE.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  updateUserLevel(user: User) {
    try {
      const { id: userId, userLevel } = user;

      return { userId, userLevel };
    } catch (e) {
      throw new HttpException(ERROR_MESSAGE.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  findUserCount() {}
}
