import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { User } from 'src/auth/decorators';
import { ClubService } from './club.service';
import { CreateClubDto } from './dto/createClub.dto';
import { deleteClubdto } from './dto/deleteClub.dto';
import { openClubdto } from './dto/openClub.dto';

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
    @User('email') email: string,
  ) {
    return this.clubService.findMember(clubType, clubTitle, email);
  }
  @Put('/open')
  async openClub(
    @Body() openClubData: openClubdto,
    @User('email') email: string,
  ) {
    await this.clubService.clubOnOff(openClubData, email , true);
  }
}
