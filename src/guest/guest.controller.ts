import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { appleRevokeDto, appleSigninDto } from './dto';
import { GuestService } from './guest.service';

@Controller('guest')
export class GuestController {
  constructor(private guestService: GuestService) {}

  @ApiOperation({
    summary: '동아리 상세 정보',
    description: '동아리 상세 정보를 가져옵니다',
  })
  @ApiResponse({
    status: 200,
    description: '동아리 상세 정보 불러오기',
  })
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
  @Get('/detail')
  async guestDetailPage(
    @Query('q') clubName: string,
    @Query('type') clubType: string,
  ) {
    return this.guestService.guestDetailPage(clubType, clubName);
  }

  @ApiOperation({
    summary: '동아리 리스트 가져오기',
    description: '동아리들을 가져옵니다',
  })
  @ApiQuery({
    name: 'type',
    description: '동아리 타입',
    enum: ['MAJOR', 'FREEDOM', 'EDITORIAL'],
  })
  @ApiResponse({ status: 200, description: '동아리들 가져옵니다' })
  @Get('/list')
  async guestList(@Query('type') clubType: string) {
    return this.guestService.list(clubType);
  }

  @Post('/apple')
  async appleSignin(@Body() data: appleSigninDto) {
    return this.guestService.appleSignin(data);
  }

  @Post('/apple/revoke')
  async appleRevoke(@Body() data: appleRevokeDto) {
    return this.guestService.appleRevoke(data);
  }
}
