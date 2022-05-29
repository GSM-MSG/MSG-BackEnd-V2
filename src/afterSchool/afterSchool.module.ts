import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Entities from '../Entities';
import { AfterSchoolController } from './afterSchool.controller';
import { AfterSchoolService } from './afterSchool.service';
import { AfterSchoolWebController } from './afterSchool.web.controller';

@Module({
  imports:[TypeOrmModule.forFeature([...Entities])],
  controllers: [AfterSchoolController,AfterSchoolWebController],
  providers: [AfterSchoolService]
})
export class AfterSchoolModule {}
