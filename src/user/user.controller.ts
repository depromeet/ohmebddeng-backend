import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserLevelDto } from './dto/create-user-level.dto';
import { GetUserLevelDto } from './dto/get-user-level.dto';
@Controller('user')
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
  async postUserLevel(
    @Body() params: CreateUserLevelDto,
  ): Promise<GetUserLevelDto> {
    return this.userService.createUserLevel(params);
  }
}
