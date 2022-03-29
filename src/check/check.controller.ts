import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import { RtGuard } from '../auth/guards';
import { Public } from '../auth/decorators';

@Controller('check')
export class CheckController {
  @Get('/')
  @HttpCode(200)
  @Public()
  @UseGuards(new RtGuard())
  check() {
    return;
  }
}
