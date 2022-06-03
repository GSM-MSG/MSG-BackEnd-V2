import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AfterSchool } from 'src/Entities/AfterSchool.entity';
import { ClassRegistration } from 'src/Entities/ClassRegistration.entity';
import { User } from 'src/Entities/User.entity';
import { Like, Repository } from 'typeorm';
import { ApplyAfterSchoolDto } from './dto/ApplyAfterSchool.dto';
import { FindDataDto } from './dto/FindData.dto';

@Injectable()
export class AfterSchoolService {
  constructor(
    @InjectRepository(AfterSchool) private afterSchool: Repository<AfterSchool>,
    @InjectRepository(User) private user: Repository<User>,
    @InjectRepository(ClassRegistration)
    private classRegistration: Repository<ClassRegistration>,
  ) {}

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
    let isApplied: boolean = false;
    let isEnabled: boolean;
    const userData = await this.user.findOne({ where: { email: email } });
    if (week === 'ALL') {
      afterSchoolData = await this.afterSchool.find({
        where: { title: Like(`%${title}%`), grade: grade, season: season },
      });
      const afterSchool = afterSchoolData.map(async (afterSchool) => {
        const classRegistration = await this.classRegistration.findOne({
          where: { afterSchool: afterSchool, user: userData },
        });
        if (classRegistration) {
          isApplied = true;
          isEnabled = true;
        }

        return afterSchool;
      });
      return { afterSchool, isApplied, isEnabled };
    } else if (week === 'ALL' && grade === 0) {
      afterSchoolData = await this.afterSchool.find({
        where: { title: Like(`%${title}%`), season: season },
      });
      return afterSchoolData;
    } else if (grade === 0) {
      afterSchoolData = await this.afterSchool.find({
        where: {
          title: Like(`%${title}%`),
          season: season,
          dayOfWeek: week,
        },
      });
      return;
    } else {
      afterSchoolData = await this.afterSchool.find({
        where: {
          title: Like(`%${title}%`),
          season: season,
          grade: grade,
          dayOfWeek: week,
        },
      });
      return afterSchoolData;
    }
  }
}
