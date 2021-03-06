import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './decorators';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OauthMobileLoginDto } from './dto/oauthLogin.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: 'OAuth2.0 로그인 - 모바일 파트',
    description: '유저 확인 후 회원가입/로그인',
  })
  @ApiResponse({ status: 200, description: '로그인 또는 회원가입 성공' })
  @Post('/mobile')
  oauthMobileLogin(@Body() data: OauthMobileLoginDto) {
    return this.authService.oauthMobileLogin(data);
  }

  @ApiOperation({
    summary: 'accessToken 재발급',
    description: '리프레시 토큰 확인후 액세스토큰 재발급',
  })
  @ApiResponse({ status: 200, description: '발급 성공' })
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  async refresh(@User('email') email: string) {
    return this.authService.refresh(email);
  }

  @ApiOperation({
    summary: '로그아웃',
    description: '로그아웃을 합니다',
  })
  @ApiResponse({ status: 200, description: '로그아웃 성공' })
  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(200)
  logout(@User('email') email: string) {
    return this.authService.logout(email);
  }
}
