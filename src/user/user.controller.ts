import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CountUsersDto } from './dto/count-users.dto';

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

  @Get('count')
  async countUsers(@Query() params): Promise<CountUsersDto> {
    return;
  }
}
