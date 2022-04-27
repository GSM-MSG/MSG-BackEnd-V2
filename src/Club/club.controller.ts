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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/auth/decorators';
import { ClubService } from './club.service';
import { AcceptUserDto } from './dto/accept.dto';
import { ClubDatadto } from './dto/clubData.dto';
import { CreateClubDto } from './dto/createClub.dto';
import { editClubdto } from './dto/editclub.dto';
import { kickUserDto } from './dto/kickuser.dto';
import { openClubdto } from './dto/openClub.dto';

@ApiTags('CLUB')
@Controller('club')
export class ClubController {
  constructor(private clubService: ClubService) {}
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '동아리 리스트 가져오기',
    description: '동아리들을 가져옵니다',
  })
  @ApiQuery({
    name: 'type',
    description: '동아리 타입',
    enum: ['MAJOR', 'FREEDOM', 'EDITORIAL'],
  })
  @ApiResponse({ status: 200, description: '동아리들 가져옵니다' })
  @Get('/list')
  async list(@Query('type') clubType: string) {
    return this.clubService.list(clubType);
  }
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '클럽 삭제 파트입니다',
    description: '삭제 시킬 동아리 정보를 받아서 동아리를 삭제합니다',
  })
  @ApiResponse({ status: 201, description: '삭제 성공' })
  @Delete('/')
  @HttpCode(201)
  async deleteClub(@Body() deleteClubData: ClubDatadto, email: string) {
    return await this.clubService.deleteClub(
      deleteClubData.q,
      deleteClubData.type,
      email,
    );
  }

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '클럽 생성 파트입니다',
    description: '클럽 데이터들을 받아 생성합니다',
  })
  @ApiResponse({ status: 201, description: '동아리 생성 성공' })
  @Post('/')
  async createClub(
    @Body() createClubData: CreateClubDto,
    @User('email') email: string,
  ) {
    await this.clubService.createClub(createClubData, email);
  }
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 201, description: '동아리 신청되었습니다' })
  @ApiOperation({
    summary: '동아리 신청',
    description: '동아리 정보를 받아 가입신청',
  })
  @Post('/apply')
  async applyClub(@Body() clubData: ClubDatadto, @User('email') email: string) {
    return this.clubService.applyClub(clubData.type, clubData.q, email);
  }
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 204, description: '동아리 신청 취소' })
  @ApiOperation({
    summary: '동아리 신청 취소',
    description: '동아리 가입신청 한 것을 취소',
  })
  @HttpCode(204)
  @Post('/cancel')
  async cancel(@Body() clubData: ClubDatadto, @User('email') email: string) {
    return this.clubService.cancelClub(clubData.type, clubData.q, email);
  }
  @ApiBearerAuth('access-token')
  @ApiResponse({status : 201 , description : '동아리 신청자 수락'})
  @Post('/accept')
  async accept(@Body() clubData: AcceptUserDto, @User('email') email: string) {
    return this.clubService.acceptClub(
      clubData.type,
      clubData.q,
      clubData.userId,
      email,
    );
  }
  @Post('/reject')
  async reject(@Body() ClubData: AcceptUserDto, @User('email') email: string) {
    return this.clubService.rejectClub(
      ClubData.type,
      ClubData.q,
      ClubData.userId,
      email,
    );
  }
  @Get('/applicant')
  async applicantList(
    @Query('type') clubType: string,
    @Query('q') clubTitle: string,
    @User('email') email: string,
  ) {
    return this.clubService.applicantList(clubType, clubTitle, email);
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
    @Query('q') clubTitle: string,
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
  @Put('/close')
  @HttpCode(201)
  async closeClub(
    @Body() closeClubData: openClubdto,
    @User('email') email: string,
  ) {
    await this.clubService.clubOnOff(closeClubData, email, false);
  }
  @Delete('/kick')
  @HttpCode(201)
  async kickUser(
    @Body() kickUserData: kickUserDto,
    @User('email') email: string,
  ) {
    await this.clubService.kickUser(kickUserData, email);
  }
  @Put('/delegation')
  async delegation(
    @Body() userData: kickUserDto,
    @User('email') email: string,
  ) {
    await this.clubService.delegation(userData, email);
  }
  @Put('')
  async putClub(
    @Body() editClubData: editClubdto,
    @User('email') email: string,
  ) {
    await this.clubService.editClub(editClubData, email);
  }
}
