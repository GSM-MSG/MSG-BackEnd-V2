import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from 'src/auth/decorators';
import { AfterSchoolService } from './afterSchool.service';
import { ListDataDto } from './dto/listData.dto';

@Controller('afterSchool')
export class AfterSchoolController {
  constructor(private afterSchoolService: AfterSchoolService) {}
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async list(@Query() listDataDto: ListDataDto, @User('email') email: string) {
    return await this.afterSchoolService.list(listDataDto, email);
  }
}
