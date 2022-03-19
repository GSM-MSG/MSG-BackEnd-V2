import { Body, Controller, Head, HttpCode, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  register(@Body() data: RegisterDto): Promise<void> {
    return this.authService.register(data);
  }

  @Head('verify')
  verifyHead(@Query('token') signupVerifyToken: string) {}
}
