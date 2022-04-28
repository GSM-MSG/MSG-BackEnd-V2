import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { RtGuard } from '../auth/guards';
import { Public } from '../auth/decorators';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('check')
export class CheckController {
  @ApiOperation({
    summary: '로그인 상태 확인',
    description: '로그인 인지 아닌지 확인합니다',
  })
  @ApiResponse({status : 200 , description : '로그인된상태'})
  @ApiResponse({status : 401 , description : '재로그인 필요'})
  @Get('/')
  @HttpCode(200)
  @Public()
  @UseGuards(new RtGuard())
  check() {
    return;
  }
}
