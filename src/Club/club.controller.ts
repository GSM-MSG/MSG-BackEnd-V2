import { Body, Controller, Delete, Get, Query } from '@nestjs/common';
import { ClubService } from './club.service';
import { deleteClubdto } from './dto/deleteClub.dto';

@Controller('club')
export class ClubController {
  constructor(private clubService: ClubService) {}
  @Get('/list')
  async list(@Query('type') clubType: string) {
    return await this.clubService.list(clubType);
  }
  @Delete('/')
  async deleteClub(@Body() deleteClubData: deleteClubdto) {
    return await this.clubService.DleteClub(
      deleteClubData.q,
      deleteClubData.type,
    );
  }
}
