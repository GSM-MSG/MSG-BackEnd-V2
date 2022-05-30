import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/auth/decorators';
import { AfterSchoolService } from './afterSchool.service';
import { ApplyAfterSchoolDto } from './dto/ApplyAfterSchool.dto';

@ApiTags('AFTERSCHOOL')
@UseGuards(AuthGuard('jwt'))
@Controller('afterSchool')
export class AfterSchoolController {
  constructor(private afterSchoolService: AfterSchoolService) {}

  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '방과후 신청',
    description: '방과후에 신청합니다.',
  })
  @ApiQuery({
    name: 'afterSchoolId',
    description: '방과후id',
    example: 1,
  })
  @ApiResponse({ status: 201, description: '방과후를 신청에 성공했습니다.' })
  @ApiResponse({ status: 404, description: '존재하지 않는 방과후입니다..' })
  @ApiResponse({ status: 404, description: '존재하지 않는 유저입니다.' })
  @Post('apply')
  async applyAfterSchool(
    @Body() applyAfterSchoolDto: ApplyAfterSchoolDto,
    @User('email') email: string,
  ) {
    this.afterSchoolService.applyAfterSchool(applyAfterSchoolDto, email);
  }
}
