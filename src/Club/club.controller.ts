import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ClubService } from './club.service';
import { CreateClubDto } from './dto/createClub.dto';
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
    return await this.clubService.DeleteClub(
      deleteClubData.q,
      deleteClubData.type,
    );
  }
  @Post('/')
  async createClub(@Body() createClubData: CreateClubDto, userId) {
    await this.clubService.CreateClub(createClubData, userId);
  }
}
