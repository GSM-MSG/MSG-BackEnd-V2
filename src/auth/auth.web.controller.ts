import {
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
import { User } from './decorators';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GoogleType } from './types/googleType';
import { ConfigService } from '@nestjs/config';

@ApiTags('AUTH')
@Controller('auth')
export class AuthWebController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async callback(@Req() req: Request, @Res() res: Response) {
    const token = await this.authService.webGoogleOauth(req.user as GoogleType);

    if (!token) {
      res.redirect(`${this.configService.get('FRONT_URL')}/login`);
      res.send({ message: 'not GSM user' });
    }

    res.cookie('accessToken', token.accessToken, {
      expires: token.AtExpired,
      httpOnly: true,
      domain: this.configService.get('DOMAIN'),
    });
    res.cookie('refreshToken', token.refreshToken, {
      expires: token.RtExpired,
      httpOnly: true,
      domain: this.configService.get('DOMAIN'),
    });
    res.redirect(this.configService.get('FRONT_URL'));
    res.send();
  }

  @Get('/web')
  @UseGuards(AuthGuard('google'))
  webGoogleOauth() {}

  @ApiOperation({
    summary: 'accessToken 재발급',
    description: '리프레시 토큰 확인후 액세스토큰 재발급',
  })
  @ApiResponse({ status: 200, description: '발급 성공' })
  @UseGuards(AuthGuard('jwtWeb-refresh'))
  @Post('refresh/web')
  async refreshWeb(
    @User('email') email: string,
    @User('accessToken') access: string,
    @Res() res: Response,
  ) {
    if (access) {
      res.send();
    }

    const token = await this.authService.refreshWeb(email);
    res.cookie('accessToken', token.accessToken, {
      expires: token.AtExpired,
      httpOnly: true,
      domain: this.configService.get('DOMAIN'),
    });
    res.cookie('refreshToken', token.refreshToken, {
      expires: token.RtExpired,
      httpOnly: true,
      domain: this.configService.get('DOMAIN'),
    });
    res.send({ accessToken: token.accessToken });
  }

  @UseGuards(AuthGuard('jwt-web'))
  @HttpCode(200)
  @Get('check')
  check() {
    return { message: '성공' };
  }

  @ApiOperation({
    summary: '로그아웃',
    description: '로그아웃을 합니다',
  })
  @ApiResponse({ status: 200, description: '로그아웃 성공' })
  @UseGuards(AuthGuard('jwt-web'))
  @Post('logout')
  @HttpCode(200)
  logoutWeb(@User('email') email: string, @Res() res: Response) {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    return this.authService.logout(email);
  }
}
