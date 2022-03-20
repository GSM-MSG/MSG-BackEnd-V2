import { Controller, Get, Query } from '@nestjs/common';
import { ClubService } from './club.service';

@Controller('club')
export class ClubController {
  constructor(private clubService: ClubService) {}
  @Get('/list')
  async list(@Query('type') clubType: string) {
    return await this.clubService.list(clubType);
  }
}
