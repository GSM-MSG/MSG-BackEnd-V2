import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AfterSchool } from 'src/Entities/AfterSchool.entity';
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

  async applyAfterSchool(ApplyAfterSchool: ApplyAfterSchoolDto, email: string) {
    console.log(ApplyAfterSchool.afterSchoolId);
    const afterSchoolData = await this.afterSchool.findOne({
      where: { id: ApplyAfterSchool.afterSchoolId },
    });
    const userData = await this.user.findOne({ where: { email } });
    if (!afterSchoolData) {
      throw new HttpException(
        '존재하지 않는 방과후입니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    await this.classRegistration.save(
      this.classRegistration.create({
        user: userData,
        afterSchool: afterSchoolData,
      }),
    );
  }
}
