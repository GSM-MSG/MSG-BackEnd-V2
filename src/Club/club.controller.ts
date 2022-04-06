import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { find } from 'rxjs';
import { ClubService } from './club.service';
import { CreateClubDto } from './dto/createClub.dto';
import { deleteClubdto } from './dto/deleteClub.dto';
import { findClubDto } from './dto/findClub.dto';

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
  @Post('/')
  async createClub(@Body() createClubData: CreateClubDto) {
    await this.clubService.CreateClub(createClubData);
  }
  @Get('/members')
  async findMembers(@Body() findClubData: findClubDto){
    console.log(findClubData)
  }
}
