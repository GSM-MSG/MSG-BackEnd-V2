import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ClubService } from './club.service';
import { ClubDatadto } from './dto/ClubData.dto';
import { CreateClubDto } from './dto/createClub.dto';

@Controller('club')
export class ClubController {
  constructor(private clubService: ClubService) {}
  @Get('/list')
  async list(@Query('type') clubType: string) {
    return await this.clubService.list(clubType);
  }
  @Delete('/')
  async deleteClub(@Body() deleteClubData: ClubDatadto) {
    return await this.clubService.DeleteClub(
      deleteClubData.q,
      deleteClubData.type,
    );
  }
  @Post('/')
  async createClub(@Body() createClubData: CreateClubDto, userId) {
    await this.clubService.CreateClub(createClubData, userId);
  }
  @Post('/apply')
  async applyClub(@Body() clubData: ClubDatadto, @Body('email') email: string) {
    console.log(email);
    return this.clubService.applyClub(clubData.type, clubData.q, email);
  }
}
