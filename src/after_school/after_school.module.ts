import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Entities from '../Entities';
import { AfterSchoolController } from './after_school.controller';
import { AfterSchoolService } from './after_school.service';
import { AfterSchoolWebController } from './after_school.web.controller';

@Module({
  imports:[TypeOrmModule.forFeature([...Entities])],
  controllers: [AfterSchoolController,AfterSchoolWebController],
  providers: [AfterSchoolService]
})
export class AfterSchoolModule {}
