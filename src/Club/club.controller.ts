import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { Public, User } from 'src/auth/decorators';
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
  async createClub(
    @Body() createClubData: CreateClubDto,
    @Body('email') email: string,
  ) {
    await this.clubService.CreateClub(createClubData, email);
  }
  @Post('/apply')
  async applyClub(@Body() clubData: ClubDatadto, @Body('email') email: string) {
    return this.clubService.applyClub(clubData.type, clubData.q, email);
  }
  @Post('/cancel')
  async cancel(@Body() clubData: ClubDatadto, @User('email') email: string) {
    return this.clubService.cancelClub(clubData.type, clubData.q, email);
  }
  @Post('/accept')
  async accept(@Body() clubData: ClubDatadto, @User('email') email: string) {
    return this.clubService.acceptClub(clubData.type, clubData.q, email);
  }
  @Post('/reject')
  async reject(@Body() ClubData: ClubDatadto, @User('email') email: string) {
    return this.clubService.rejectClub(ClubData.type, ClubData.q, email);
  }
  @Get('/applicant')
  async applicantList(@Body() ClubData: ClubDatadto) {
    return this.clubService.applicantList(ClubData.type, ClubData.q);
  }
  @Get('/detail')
  async detailPage(
    @Query('q') clubname: string,
    @Query('type') clubtype: string,
  ) {
    return this.clubService.detailPage(clubtype, clubname);
  }
}
