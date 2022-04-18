import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Put,
  Query,
} from '@nestjs/common';
import { User } from 'src/auth/decorators';
import { exitDataDto } from './dto/exit.dto';
import { urlDto } from './dto/urlAddress.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('/my')
  async userData(@User('email') email: string) {
    return this.userService.getUserData(email);
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
    return this.userService.searchUser(name, clubType);
  }
  @Delete('/exit')
  async exitClub(
    @Body() exitClubData: exitDataDto,
    @User('email') email: string,
  ) {
    await this.userService.exitClub(exitClubData, email);
  }
}
