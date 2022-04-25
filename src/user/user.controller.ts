import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/auth/decorators';
import { exitDataDto } from './dto/exit.dto';
import { urlDto } from './dto/urlAddress.dto';
import { UserService } from './user.service';

@ApiTags('USER')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @ApiOperation({
    summary: '유저정보 가져오기',
    description: '요청보낸 유저의 이메일을 통해 유저를 가져옵니다',
  })
  //@ApiHeader(ApiBearerAuth)
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: '성공' })
  @Get('/my')
  async userData(@User('email') email: string) {
    return this.userService.getUserData(email);
  }
  @ApiOperation({
    summary: '프로필 이미지 변경',
    description: 's3로 배포된 사진의 주소를 받아 유저의 프로필을 변경합니다',
  })
  @Put('/profile')
  @HttpCode(201)
  async editImg(@Body() urlAddress: urlDto, @User('email') email: string) {
    await this.userService.editProfile(urlAddress, email);
  }
  @ApiOperation({
    summary: '유저 검색',
    description:
      '동아리 생성시 멤버를 검색하여 동아리가 이미 있는지 없는지 검색합니다',
  })
  @Get('/search')
  async searchUser(
    @Query('name') name: string,
    @Query('type') clubType: string,
  ) {
    return this.userService.searchUser(name, clubType);
  }
  @ApiOperation({
    summary: '동아리 탈퇴',
    description: '유저가 동아리 탈퇴할하는 파트입니다',
  })
  @Delete('/exit')
  async exitClub(
    @Body() exitClubData: exitDataDto,
    @User('email') email: string,
  ) {
    await this.userService.exitClub(exitClubData, email);
  }
}
