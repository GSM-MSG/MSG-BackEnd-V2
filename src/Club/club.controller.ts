import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ClubService } from './club.service';
import { CreateClubDto } from './dto/createClub.dto';
import { deleteClubdto } from './dto/deleteClub.dto';

@Controller('club')
export class ClubController {
  constructor(private clubService: ClubService) {}
  @Get('/list')
  async list(@Query('type') clubType: string) {
    return this.clubService.list(clubType);
  }
  @Delete('/')
  async deleteClub(@Body() deleteClubData: deleteClubdto) {
    return await this.clubService.DleteClub(
      deleteClubData.q,
      deleteClubData.type,
    );
  }
  @Post('/')
  async createClub(@Body() createClubData: CreateClubDto) {
    await this.clubService.CreateClub(createClubData);
  }
  @Get('/members')
  async findMembers(
    @Query('type') clubType: string,
    @Query('title') clubTitle: string,
  ) {
    return this.clubService.findMember(clubType, clubTitle);
  }
}
