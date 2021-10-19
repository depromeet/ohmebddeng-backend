import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { updateUserLevelDto } from './dto/create-user-level.dto';
import { findUserLevelDto } from './dto/get-user-level.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetAnonymousUserDto } from './dto/get-anonymous-user.dto';
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
    type: GetAnonymousUserDto,
  })
  async createAnonymousUser(): Promise<GetAnonymousUserDto> {
    return this.userService.createAnonymousUser();
  }

  // 익명 사용자 ID 기반 사용자 정보 조회
  @Get(':userId')
  @ApiOperation({
    summary: '사용자 ID 기반 사용자 정보 조회 API',
    description: '사용자 ID를 기반으로 사용자를 찾아 반환한다',
  })
  @ApiParam({ name: '사용자ID', type: String })
  @ApiResponse({ description: '사용자에 대한 정보를 받는다', type: User })
  async findUser(@Param() params): Promise<User> {
    return this.userService.findUser(params.userId);
  }

  // 사용자 레벨 테스트 제출
  @Post('level')
  @ApiOperation({
    summary: '사용자 레벨테스트 결과 제출 API',
    description: `레벨테스트 응답결과를 제출하고 사용자의 레벨을 받는다. (참고) hotLevel =  "EASY" | "NORMAL" | "HOT" | "HOTTEST"`,
  })
  @ApiBody({ type: updateUserLevelDto })
  @ApiResponse({
    description: '사용자의 ID와 레벨을 받는다',
    status: 200,
    type: findUserLevelDto,
  })
  async updateUserLevel(
    @Body() params: updateUserLevelDto,
  ): Promise<findUserLevelDto> {
    return this.userService.updateUserLevel(params);
  }
}
