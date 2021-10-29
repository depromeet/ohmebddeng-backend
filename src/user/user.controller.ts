import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { FindUserCountDto } from './dto/find-user-count.dto';

import { updateUserLevelDto } from './dto/create-user-level.dto';
import { FindUserLevelDto } from './dto/find-user-level.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FindAnonymousUserDto } from './dto/find-anonymous-user.dto';
import { FindUserCountQueryDto } from './dto/find-user-count-query.dto';
import { FindUserDto } from './dto/find-user.dto';
@Controller('user')
@ApiTags('사용자 API')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 익명 사용자 ID 발급
  @Get('anonymous')
  @ApiOperation({
    summary: '익명 사용자 ID 발급 API',
    description: '익명 사용자 ID를 생성하고 반환한다',
  })
  @ApiResponse({
    description: '익명사용자 ID를 발급받는다',
    type: FindAnonymousUserDto,
  })
  async createAnonymousUser(): Promise<FindAnonymousUserDto> {
    return this.userService.createAnonymousUser();
  }

  // 서비스를 사용한 사용자 수 조회
  @Get('count')
  @ApiOperation({
    summary: '사용자 수 조회 API',
    description: '총 사용자 수 혹은 레벨테스트를 마친 사용자 수를 조회한다',
  })
  @ApiQuery({
    name: 'levelTestedOnly',
    type: FindUserCountQueryDto,
    description: '레벨테스트를 마친 사용자 수만 조회할지 여부',
  })
  @ApiResponse({
    description:
      'levelTestedOnly === true 이면 레벨테스트를 마친 사용자 수를, 이외의 경우에는 총 사용자 수를 받는다',
    type: FindUserCountDto,
  })
  async findUserCount(
    @Query() param: FindUserCountQueryDto,
  ): Promise<FindUserCountDto> {
    return this.userService.findUserCount(param);
  }

  // 익명 사용자 ID 기반 사용자 정보 조회
  @Get(':userId')
  @ApiOperation({
    summary: '사용자 ID 기반 사용자 정보 조회 API',
    description: '사용자 ID를 기반으로 사용자를 찾아 반환한다',
  })
  @ApiParam({ name: '사용자ID', type: String })
  @ApiResponse({
    description: '사용자에 대한 정보를 받는다',
    type: FindUserDto,
  })
  async findUser(@Param() params): Promise<FindUserDto> {
    return this.userService.findUser(params.userId);
  }
  // 사용자 레벨 테스트 제출
  @Post('level')
  @ApiOperation({
    summary: '사용자 레벨테스트 결과 제출 API',
    description: `레벨테스트 응답결과를 제출하고 사용자의 레벨을 받는다. (참고) hotLevel =  "냠냠" | "쓰읍" | "씁하" | "헥헥" | "모름"`,
  })
  @ApiBody({ type: updateUserLevelDto })
  @ApiResponse({
    description: '사용자의 ID와 레벨을 받는다',
    status: 200,
    type: FindUserLevelDto,
  })
  async updateUserLevel(
    @Body() params: updateUserLevelDto,
  ): Promise<FindUserLevelDto> {
    return this.userService.updateUserLevel(params);
  }
}
