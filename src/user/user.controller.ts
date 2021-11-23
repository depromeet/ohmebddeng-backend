import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FindUserCountDto } from './dto/find-user-count.dto';

import { updateUserLevelDto } from './dto/create-user-level.dto';
import { FindUserLevelDto } from './dto/find-user-level.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FindAnonymousUserDto } from './dto/find-anonymous-user.dto';
import { FindUserCountQueryDto } from './dto/find-user-count-query.dto';
import { FindUserRequestDto, FindUserResponseDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ERROR_MESSAGE } from '@common/enums/error-message';
@Controller('user')
@ApiTags('사용자 API')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 익명 사용자 ID 발급
  @Get('anonymous')
  @ApiOperation({ summary: '익명 사용자를 생성하는 API' })
  async createAnonymousUser(): Promise<FindAnonymousUserDto> {
    return this.userService.createAnonymousUser();
  }

  // 서비스를 사용한 사용자 수 조회
  @Get('count')
  @ApiOperation({ summary: '총 사용자 수를 조회하는 API' })
  async findUserCount(
    @Query() params: FindUserCountQueryDto,
  ): Promise<FindUserCountDto> {
    // levelTestedOnly는 query param이라 string으로만 받아짐.
    const levelTestedOnly = params.levelTestedOnly === 'true';
    const count = await this.userService.findUserCount(levelTestedOnly);

    return { count, levelTestedOnly };
  }

  // 익명 사용자 ID 기반 사용자 정보 조회
  @Get(':userId')
  @ApiOperation({ summary: '특정 사용자의 정보를 가져오는 API' })
  async findUser(
    @Param() params: FindUserRequestDto,
  ): Promise<FindUserResponseDto | Omit<FindUserResponseDto, 'userLevel'>> {
    const { userId } = params;
    const user = await this.userService.findUser(userId);

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

  // 사용자 레벨 테스트 제출
  @Post('level')
  @ApiOperation({ summary: '사용자의 Level Test 결과를 생성/업데이트하는 API' })
  async updateUserLevel(
    @Body() params: updateUserLevelDto,
  ): Promise<FindUserLevelDto> {
    return this.userService.updateUserLevel(params);
  }
}
