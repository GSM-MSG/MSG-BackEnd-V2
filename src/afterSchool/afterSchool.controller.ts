import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/auth/decorators';
import { AfterSchoolService } from './afterSchool.service';
import { ApplyAfterSchoolDto } from './dto/ApplyAfterSchool.dto';

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
