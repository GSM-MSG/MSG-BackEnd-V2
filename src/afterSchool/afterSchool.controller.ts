import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/decorators';
import { AfterSchoolService } from './afterSchool.service';
import { ApplyAfterSchoolDto } from './dto/ApplyAfterSchool.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('afterSchool')
export class AfterSchoolController {
  constructor(private afterSchoolService: AfterSchoolService) {}

  @Post('apply')
  async applyAfterSchool(
    @Body() ApplyAfterSchoolDto: ApplyAfterSchoolDto,
    @User('email') email: string,
  ) {
    this.afterSchoolService.applyAfterSchool(ApplyAfterSchoolDto, email);
  }
}
