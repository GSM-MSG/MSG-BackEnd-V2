import {
  Body,
  Controller,
  Get,
  Head,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Public, User } from './decorators';
import { RtGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(201)
  register(@Body() data: RegisterDto): Promise<void> {
    return this.authService.register(data);
  }

  @Public()
  @Head('verify')
  @HttpCode(200)
  isVerify(@Query('email') email: string) {
    return this.authService.isVerify(email);
  }

  @Public()
  @Get('verify')
  verify(@Query('token') token: string, @Query('user') email: string) {
    return this.authService.verify(email, token);
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
