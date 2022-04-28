import {
  Body,
  Controller,
  Head,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, User } from './decorators';
import { RtGuard } from './guards';
import { LoginDto, RegisterDto, VerifyDto, verifyHeadDto } from './dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: '회원가입',
    description: '회원가입 창입니다',
  })
  @ApiResponse({ status: 201, description: '회원가입 성공' })
  @Public()
  @Post('register')
  @HttpCode(201)
  register(@Body() data: RegisterDto): Promise<void> {
    return this.authService.register(data);
  }

  @ApiOperation({
    summary: '인증파트',
    description: '인증번호 발송 파트',
  })
  @ApiResponse({ status: 200, description: '인증코드 발송' })
  @Public()
  @Head('verify')
  @HttpCode(200)
  isVerify(@Query() data: verifyHeadDto) {
    return this.authService.isVerify(data);
  }

  @ApiOperation({
    summary: '인증 번호 확인 파트',
    description: '인증번호 발송 후 인증번호 비교',
  })
  @ApiResponse({ status: 200, description: '인증코드 검사 성공 회원가입' })
  @Public()
  @Post('verify')
  @HttpCode(201)
  verify(@Body() data: VerifyDto) {
    return this.authService.verify(data);
  }

  @Public()
  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Public()
  @UseGuards(new RtGuard())
  @Post('refresh')
  refresh(
    @User('email') email: string,
    @User('refreshToken') refreshToken: string,
  ) {
    return this.authService.refresh(email, refreshToken);
  }

  @Post('logout')
  @HttpCode(200)
  logout(@User('email') email: string) {
    return this.authService.logout(email);
  }
}
