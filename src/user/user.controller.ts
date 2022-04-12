import { Body, Controller, Get, HttpCode, Put } from '@nestjs/common';
import { User } from 'src/auth/decorators';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('my')
  async userData(@User('email') email: string) {
    return await this.userService.getUserData(email);
  }
}
