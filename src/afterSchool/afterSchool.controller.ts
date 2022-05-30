import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AfterSchoolService } from './afterSchool.service';
import { ListDataDto } from './dto/listData.dto';

@Controller('afterSchool')
export class AfterSchoolController {
  constructor(private afterSchoolService: AfterSchoolService) {}
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async list(@Query() listDataDto: ListDataDto) {
    return await this.afterSchoolService.list(listDataDto);
  }
}
