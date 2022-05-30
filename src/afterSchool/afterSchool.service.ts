import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AfterSchool } from 'src/Entities/AfterSchool.entity';
import { Repository } from 'typeorm';
import { ListDataDto } from './dto/listData.dto';

@Injectable()
export class AfterSchoolService {
  constructor(
    @InjectRepository(AfterSchool)
    private afterSchoolRepository: Repository<AfterSchool>,
  ) {}
  async list(listDataDto: ListDataDto) {
    if (listDataDto.week === 'ALL') {
      let data = await this.afterSchoolRepository.find({
        select: {
          id: true,
          title: true,
          dayOfWeek: true,
          grade: true,
          personnel: true,
          maxPersonnel: true,
          isOpened: true,
        },
        where: {
          season: listDataDto.season,
          grade: listDataDto.grade,
        },
      });
      return data;
    } else {
      let data = await this.afterSchoolRepository.find({
        select: {
          id: true,
          title: true,
          dayOfWeek: true,
          grade: true,
          personnel: true,
          maxPersonnel: true,
          isOpened: true,
        },
        where: {
          season: listDataDto.season,
          dayOfWeek: listDataDto.week,
          grade: listDataDto.grade,
        },
      });
      return data;
    }
  }
}
