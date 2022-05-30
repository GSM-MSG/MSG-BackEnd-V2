import { Controller, Get, Query } from '@nestjs/common';
import { User } from 'src/auth/decorators';
import { AfterSchoolService } from './afterSchool.service';

@Controller('after-school')
export class AfterSchoolController {
  constructor(private afterSchoolService: AfterSchoolService) {}
  @Get()
  async list(
    @Query('season') season: string,
    @Query('week') week: string,
    @Query('grade') grade: number,
    @User('email') email: string,
  ) {
    return await this.afterSchoolService.list(season, week, grade, email);
  }
}
