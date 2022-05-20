import { UseGuards } from '@nestjs/common';
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
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/auth/decorators';
import { ClubService } from './club.service';
import { AcceptUserDto } from './dto/Accept.dto';
import { ClubDataDto } from './dto/ClubData.dto';
import { CreateClubDto } from './dto/CreateClub.dto';
import { EditClubdto } from './dto/EditClub.dto';

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
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
  @Delete('/')
  @HttpCode(201)
  async deleteClub(
    @Body() deleteClubData: ClubDataDto,
    @User('email') email: string,
  ) {
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
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
  @Post('/apply')
  async applyClub(@Body() clubData: ClubDataDto, @User('email') email: string) {
    return this.clubService.applyClub(clubData.type, clubData.q, email);
  }
  @ApiBearerAuth('access-token')
  @ApiResponse({ status: 204, description: '동아리 신청 취소' })
  @ApiOperation({
    summary: '동아리 신청 취소',
    description: '동아리 가입신청 한 것을 취소',
  })
  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'))
  @Post('/cancel')
  async cancel(@Body() clubData: ClubDataDto, @User('email') email: string) {
    return this.clubService.cancelClub(clubData.type, clubData.q, email);
  }
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '동아리 신청자 수락',
    description: '동아리 가입신청 한 것을 부장이 수락',
  })
  @ApiResponse({ status: 201, description: '동아리 신청자 수락' })
  @UseGuards(AuthGuard('jwt'))
  @Post('/accept')
  async accept(@Body() clubData: AcceptUserDto, @User('email') email: string) {
    return this.clubService.acceptClub(
      clubData.type,
      clubData.q,
      clubData.userId,
      email,
    );
  }
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '동아리 가입신청 거절',
    description: '동아리 가입신청 한 것을 부장이 거절',
  })
  @ApiResponse({ status: 201, description: '동아리 신청자 거절' })
  @UseGuards(AuthGuard('jwt'))
  @Post('/reject')
  async reject(@Body() ClubData: AcceptUserDto, @User('email') email: string) {
    return this.clubService.rejectClub(
      ClubData.type,
      ClubData.q,
      ClubData.userId,
      email,
    );
  }
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '동아리 신청자 리스트',
    description:
      '동아리에 신청한 사람을 부장이 확인 할 수 있는 리스트 가져오기',
  })
  @ApiResponse({
    status: 200,
    description: '동아리 신청한 사람들 리스트 가져옵니다',
  })
  @ApiQuery({
    name: 'q',
    description: '동아리 이름',
    example: '클라우드 컴퓨팅',
  })
  @ApiQuery({
    name: 'type',
    description: '동아리 타입',
    enum: ['MAJOR', 'FREEDOM', 'EDITORIAL'],
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/applicant')
  async applicantList(
    @Query('type') clubType: string,
    @Query('q') clubTitle: string,
    @User('email') email: string,
  ) {
    return this.clubService.applicantList(clubType, clubTitle, email);
  }
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '동아리 상세 정보',
    description: '동아리 상세 정보를 가져옵니다',
  })
  @ApiResponse({
    status: 200,
    description: '동아리 상세 정보 불러오기',
  })
  @ApiQuery({
    name: 'q',
    description: '동아리 이름',
    example: '클라우드 컴퓨팅',
  })
  @ApiQuery({
    name: 'type',
    description: '동아리 타입',
    enum: ['MAJOR', 'FREEDOM', 'EDITORIAL'],
  })
  @Get('/guest/detail')
  async guestDetailPage(
    @Query('q') clubName: string,
    @Query('type') clubType: string,
  ) {
    return this.clubService.guestDetailPage(clubType, clubName);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/detail')
  async detailPage(
    @Query('q') clubname: string,
    @Query('type') clubtype: string,
    @User('email') email: string,
  ) {
    return this.clubService.detailPage(clubtype, clubname, email);
  }
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '동아리 멤버 불러오기',
    description: '동아리 멤버들을 불러옵니다',
  })
  @ApiResponse({
    status: 200,
    description: '동아리 맴버를 가져옵니다',
  })
  @ApiQuery({
    name: 'q',
    description: '동아리 이름',
    example: '클라우드 컴퓨팅',
  })
  @ApiQuery({
    name: 'type',
    description: '동아리 타입',
    enum: ['MAJOR', 'FREEDOM', 'EDITORIAL'],
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/members')
  async findMembers(
    @Query('type') clubType: string,
    @Query('q') clubTitle: string,
    @User('email') email: string,
  ) {
    return this.clubService.findMember(clubType, clubTitle, email);
  }
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '클럽 동아리 신청 받는거 오픈하기',
    description: '동아리 신청 받는 버튼 활성화',
  })
  @ApiResponse({ status: 201, description: '성공적으로 열렸습니다' })
  @UseGuards(AuthGuard('jwt'))
  @Put('/open')
  @HttpCode(201)
  async openClub(
    @Body() openClubData: ClubDataDto,
    @User('email') email: string,
  ) {
    await this.clubService.clubOnOff(openClubData, email, true);
  }
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '클럽 동아리 신청 받는거 비활성화',
    description: '동아리 신청 받는 버튼 비활성화',
  })
  @ApiResponse({ status: 201, description: '성공적으로 닫혔습니다' })
  @UseGuards(AuthGuard('jwt'))
  @Put('/close')
  @HttpCode(201)
  async closeClub(
    @Body() closeClubData: ClubDataDto,
    @User('email') email: string,
  ) {
    await this.clubService.clubOnOff(closeClubData, email, false);
  }
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '동아리 멤버 추방',
    description: '클럽 멤버에 있는 부장이 추방합니다',
  })
  @ApiResponse({ status: 201, description: '추방성공했습니다' })
  @UseGuards(AuthGuard('jwt'))
  @Delete('/kick')
  @HttpCode(201)
  async kickUser(
    @Body() kickUserData: AcceptUserDto,
    @User('email') email: string,
  ) {
    await this.clubService.kickUser(kickUserData, email);
  }
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '부장권한 위임',
    description: '동아리 멤버에게 권한 위임',
  })
  @ApiResponse({ status: 201, description: '권한 위임 성공' })
  @ApiResponse({ status: 403, description: '부장이 아닙니다' })
  @ApiResponse({ status: 404, description: '유저가 없습니다' })
  @UseGuards(AuthGuard('jwt'))
  @Put('/delegation')
  async delegation(
    @Body() userData: AcceptUserDto,
    @User('email') email: string,
  ) {
    await this.clubService.delegation(userData, email);
  }
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '동아리 수정',
    description: '동아리 수정합니다',
  })
  @ApiResponse({ status: 201, description: '동아리 수정 성공' })
  @UseGuards(AuthGuard('jwt'))
  @Put('')
  async putClub(
    @Body() editClubData: EditClubdto,
    @User('email') email: string,
  ) {
    await this.clubService.editClub(editClubData, email);
  }
}
