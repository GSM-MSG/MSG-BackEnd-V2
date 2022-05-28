import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubController } from './club.controller';
import { ClubService } from './club.service';
import { ClubWebController } from './club.web.controller';
import Entities from '../Entities';

@Module({
  imports: [TypeOrmModule.forFeature([...Entities])],
  controllers: [ClubController, ClubWebController],
  providers: [ClubService],
})
export class ClubModule {}
