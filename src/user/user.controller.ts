import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserLevelDto } from './dto/create-user-level.dto';
import { GetUserLevelDto } from './dto/get-user-level.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HOT_LEVEL } from 'src/food/enums/hot-level';
import { UserLevel } from './entities/user_level.entity';
@Controller('user')
@ApiTags('사용자 API')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('anonymous')
  async getAnonymousId(): Promise<Pick<User, 'anonymousId'>> {
    return this.userService.createAnonymousUser();
  }

  @Get(':anonymousId')
  async getUser(@Param() params): Promise<User> {
    return this.userService.findUser(params.anonymousId);
  }

  @Post('level')
  @ApiOperation({
    summary: '사용자 레벨테스트 결과 제출 API',
    description: `레벨테스트 응답결과를 제출하고 사용자의 레벨을 받는다. (참고) hotLevel =  "EASY" | "NORMAL" | "HOT" | "HOTTEST"`,
  })
  @ApiParam({ name: '사용자 레벨테스트 제출', type: CreateUserLevelDto })
  @ApiResponse({
    description: '사용자의 ID와 레벨을 받는다',
    status: 200,
    type: GetUserLevelDto,
  })
  async postUserLevel(
    @Body() params: CreateUserLevelDto,
  ): Promise<GetUserLevelDto> {
    return this.userService.createUserLevel(params);
  }
}
