import { Injectable } from '@nestjs/common';
import { ListDataDto } from './dto/listData.dto';

@Injectable()
export class AfterSchoolService {
  async list(listDataDto: ListDataDto, email: string) {}
}
