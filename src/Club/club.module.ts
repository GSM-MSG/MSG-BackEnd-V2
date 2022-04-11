import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubController } from './club.controller';
import { ClubService } from './club.service';
import entities from '../Entities';

@Module({
  imports: [TypeOrmModule.forFeature([...entities])],
  controllers: [ClubController],
  providers: [ClubService],
})
export class ClubModule {}
