import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Public, User } from './decorators';
import { RtGuard } from './guards';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OauthMobileLoginDto } from './dto/oauthLogin.dto';
import { AuthGuard } from '@nestjs/passport';
import { GoogleType } from './types/googleType';
import { ConfigService } from '@nestjs/config';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Public()
  @ApiOperation({
    summary: 'OAuth2.0 로그인 - 모바일 파트',
    description: '유저 확인 후 회원가입/로그인',
  })
  @ApiResponse({ status: 200, description: '로그인 또는 회원가입 성공' })
  @Post('/mobile')
  oauthMobileLogin(@Body() data: OauthMobileLoginDto) {
    return this.authService.oauthMobileLogin(data);
  }

  @Public()
  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async callback(@Req() req: Request, @Res() res: Response) {
    const token = await this.authService.webGoogleOauth(req.user as GoogleType);
    res.cookie('accessToken', token.accessToken, {
      expires: token.AtExpired,
      domain: this.configService.get('DOMAIN'),
    });
    res.cookie('refreshToken', token.refreshToken, {
      expires: token.RtExpired,
      domain: this.configService.get('DOMAIN'),
    });
    res.send();
  }

  @Public()
  @Get('/web')
  @UseGuards(AuthGuard('google'))
  webGoogleOauth() {}

  @ApiOperation({
    summary: 'accessToken 재발급',
    description: '리프레시 토큰 확인후 액세스토큰 재발급',
  })
  @ApiResponse({ status: 200, description: '발급 성공' })
  @Public()
  @UseGuards(new RtGuard())
  @Post('refresh')
  refresh(
    @User('email') email: string,
    @User('refreshToken') refreshToken: string,
  ) {
    return this.authService.refresh(email, refreshToken);
  }

  @ApiOperation({
    summary: '로그아웃',
    description: '로그아웃을 합니다',
  })
  @ApiResponse({ status: 200, description: '로그아웃 성공' })
  @Post('logout')
  @HttpCode(200)
  logout(@User('email') email: string) {
    return this.authService.logout(email);
  }
}
