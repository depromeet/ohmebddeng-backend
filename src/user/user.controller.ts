import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('anonymous')
  async getAnonymousId(): Promise<Pick<User, 'anonymousId'>> {
    return this.userService.createAnonymousUser();
  }

  @Get()
  async getUser(): Promise<User> {
    return;
  }
}
