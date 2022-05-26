import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubController } from './club.controller';
import { ClubService } from './club.service';
import { ClubWebController } from './club.web.controller';
import entities from '../Entities';

@Module({
  imports: [TypeOrmModule.forFeature([...entities])],
  controllers: [ClubController, ClubWebController],
  providers: [ClubService],
})
export class ClubModule {}
