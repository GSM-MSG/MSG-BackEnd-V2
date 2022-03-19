import {
  Body,
  Controller,
  Get,
  Head,
  HttpCode,
  Post,
  Query,
} from '@nestjs/common';
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
  @HttpCode(200)
  isVerify(@Query('email') email: string) {
    return this.authService.isVerify(email);
  }

  @Get('verify')
  verify(@Query('token') token: string, @Query('user') email: string) {
    return this.authService.verify(email, token);
  }
}
