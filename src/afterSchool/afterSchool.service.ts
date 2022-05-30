import { InjectRepository } from '@nestjs/typeorm';
import { AfterSchool } from 'src/Entities/AfterSchool.entity';
import { ListDataDto } from './dto/listData.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ClassRegistration } from 'src/Entities/ClassRegistration.entity';
import { User } from 'src/Entities/User.entity';
import { Repository } from 'typeorm';
import { ApplyAfterSchoolDto } from './dto/ApplyAfterSchool.dto';

@Injectable()
export class AfterSchoolService {
  constructor(
    @InjectRepository(AfterSchool) private afterSchool: Repository<AfterSchool>,
    @InjectRepository(User) private user: Repository<User>,
    @InjectRepository(ClassRegistration)
    private classRegistration: Repository<ClassRegistration>,
  ) {}
  async list(listDataDto: ListDataDto) {
    if (listDataDto.week === 'ALL') {
      let data = await this.afterSchool.find({
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
      let data = await this.afterSchool.find({
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
  async applyAfterSchool(applyAfterSchool: ApplyAfterSchoolDto, email: string) {
    const afterSchoolData = await this.afterSchool.findOne({
      where: { id: applyAfterSchool.afterSchoolId },
    });
    const userData = await this.user.findOne({ where: { email } });
    if (!afterSchoolData) {
      throw new HttpException(
        '존재하지 않는 방과후입니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    if (!userData) {
      throw new HttpException('유저가 존재하지 않아yo', HttpStatus.NOT_FOUND);
    }

    await this.classRegistration.save(
      this.classRegistration.create({
        user: userData,
        afterSchool: afterSchoolData,
      }),
    );
  }
}
