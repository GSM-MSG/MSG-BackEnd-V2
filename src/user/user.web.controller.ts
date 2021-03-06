import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/auth/decorators';
import { ClubDataDto } from '../Club/dto/ClubData.dto';
import { UrlDto } from './dto/urlAddress.dto';
import { UserService } from './user.service';

@ApiTags('USER')
@UseGuards(AuthGuard('jwt-web'))
@Controller('/user/web')
export class UserWebController {
  constructor(private userService: UserService) {}
  @ApiOperation({
    summary: '유저정보 가져오기',
    description: '요청보낸 유저의 이메일을 통해 유저를 가져옵니다',
  })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiBearerAuth('access-token')
  @Get('/my')
  async userData(@User('email') email: string) {
    return this.userService.getUserData(email);
  }

  @ApiOperation({
    summary: '프로필 이미지 변경',
    description: 's3로 배포된 사진의 주소를 받아 유저의 프로필을 변경합니다',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 201, description: '성공' })
  @Put('/profile')
  @HttpCode(201)
  async editImg(@Body() urlAddress: UrlDto, @User('email') email: string) {
    await this.userService.editProfile(urlAddress, email);
  }

  @ApiOperation({
    summary: '유저 검색',
    description:
      '동아리 생성시 멤버를 검색하여 동아리가 이미 있는지 없는지 검색합니다',
  })
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 200, description: '검색성공' })
  @ApiQuery({
    name: 'q',
    description: '동아리 이름',
    example: '클라우드 컴퓨팅',
  })
  @ApiQuery({
    name: 'type',
    description: '동아리 타입',
    enum: ['MAJOR', 'FREEDOM', 'EDITORIAL'],
  })
  @Get('/search')
  async searchUser(
    @Query('name') name: string,
    @Query('type') clubType: string,
    @User('email') email: string,
  ) {
    return this.userService.searchUser(name, clubType, email);
  }

  @ApiOperation({
    summary: '동아리 탈퇴',
    description: '유저가 동아리 탈퇴하는 파트입니다',
  })
  @ApiBearerAuth('access-token')
  @Post('/exit')
  async exitClub(
    @Body() exitClubData: ClubDataDto,
    @User('email') email: string,
  ) {
    await this.userService.exitClub(exitClubData, email);
  }
}
