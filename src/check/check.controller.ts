import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('check')
export class CheckController {
  @Get('/')
  @HttpCode(200)
  check() {
    return;
  }
}
