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
    return this.clubService.applyClub(clubData.type, clubData.q, email);
  }
  @Post('/cancle')
  async cancle(@Body() clubData: ClubDatadto, @Body('email') email: string) {
    return this.clubService.cancleClub(clubData.type, clubData.q, email);
  }
  @Post('/accept')
  async accept(@Body() clubData: ClubDatadto, @Body('email') email: string) {
    return this.clubService.acceptClub(clubData.type, clubData.q, email);
  }
  @Post('/reject')
  async reject(@Body() ClubData: ClubDatadto, @Body('email') email: string) {
    return this.clubService.rejectClub(ClubData.type, ClubData.q, email);
  }
  @Get('/applicant')
  async applicantList(@Body() ClubData: ClubDatadto) {
    return this.clubService.applicantList(ClubData.type, ClubData.q);
  }
}
