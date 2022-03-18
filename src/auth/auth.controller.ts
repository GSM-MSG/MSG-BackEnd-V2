import { Body, Controller, Head, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() data: RegisterDto): Promise<void> {
    return this.authService.register(data);
  }

  @Head('verify')
  verifyHead(@Query('signupVerifyToken') signupVerifyToken: string) {}
}
