import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { User } from 'src/auth/decorators';
import { ClubService } from './club.service';
import { ClubDatadto } from './dto/ClubData.dto';
import { CreateClubDto } from './dto/createClub.dto';
import { kickUserDto } from './dto/kickuser.dto';
import { openClubdto } from './dto/openClub.dto';

@Controller('club')
export class ClubController {
  constructor(private clubService: ClubService) {}
  @Get('/list')
  async list(@Query('type') clubType: string) {
    return this.clubService.list(clubType);
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
  @Get('/members')
  async findMembers(
    @Query('type') clubType: string,
    @Query('title') clubTitle: string,
    @User('email') email: string,
  ) {
    return this.clubService.findMember(clubType, clubTitle, email);
  }
  @Put('/open')
  @HttpCode(201)
  async openClub(
    @Body() openClubData: openClubdto,
    @User('email') email: string,
  ) {
    await this.clubService.clubOnOff(openClubData, email, true);
  }
  @Put('close')
  @HttpCode(201)
  async closeClub(
    @Body() closeClubData: openClubdto,
    @User('email') email: string,
  ) {
    await this.clubService.clubOnOff(closeClubData, email, false);
  }
  @Put('kick')
  @HttpCode(201)
  async kickUser(
    @Body() kickUserData: kickUserDto,
    @User('email') email: string,
  ) {}
}
