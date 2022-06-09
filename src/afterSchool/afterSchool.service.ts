import { InjectRepository } from '@nestjs/typeorm';
import { AfterSchool } from 'src/Entities/AfterSchool.entity';
import { ListDataDto } from './dto/listData.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ClassRegistration } from 'src/Entities/ClassRegistration.entity';
import { DayOfWeek } from 'src/Entities/DayOfWeek.entity';
import { Grade } from 'src/Entities/Grade.entity';
import { User } from 'src/Entities/User.entity';
import { Like, Repository } from 'typeorm';
import { ApplyAfterSchoolDto } from './dto/ApplyAfterSchool.dto';
import { FindDataDto } from './dto/FindData.dto';

@Injectable()
export class AfterSchoolService {
  constructor(
    @InjectRepository(AfterSchool) private afterSchool: Repository<AfterSchool>,
    @InjectRepository(User) private user: Repository<User>,
    @InjectRepository(DayOfWeek) private dayOfWeek: Repository<DayOfWeek>,
    @InjectRepository(Grade) private grade: Repository<Grade>,
    @InjectRepository(ClassRegistration)
    private classRegistration: Repository<ClassRegistration>,
  ) {}
  async list(listDataDto: ListDataDto, email: string) {}
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
  async findAfterScool(findDataDto: FindDataDto, email: string) {
    const { grade, season, title, week } = findDataDto;
    let afterSchoolData: AfterSchool[];
    let isApplicant: boolean = false;
    let isEnabled: boolean;

    if (week === 'ALL') {
      afterSchoolData = await this.afterSchool.find({
        where: { title: Like(`%${title}%`) },
        relations: ['dayOfWeek'],
        select: {
          id: true,
          dayOfWeek: {
            dayOfWeek: true,
          },
        },
      });
      return afterSchoolData;
    }
  }
}
