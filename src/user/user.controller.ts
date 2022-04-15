import { Body, Controller, Get, HttpCode, Put, Query } from '@nestjs/common';
import { User } from 'src/auth/decorators';
import { urlDto } from './dto/urlAddress.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('/my')
  async userData(@User('email') email: string) {
    return await this.userService.getUserData(email);
  }
  @Put('/profile')
  @HttpCode(201)
  async editImg(@Body() urlAddress: urlDto, @User('email') email: string) {
    await this.userService.editProfile(urlAddress, email);
  }
  @Get('/search')
  async searchUser(
    @Query('name') name: string,
    @Query('type') clubType: string,
  ) {
    await this.userService.searchUser(name, clubType);
  }
}
