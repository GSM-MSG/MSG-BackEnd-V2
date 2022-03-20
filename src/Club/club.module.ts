import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Club } from 'src/Entities/Club.entity';
import { ClubController } from './club.controller';
import { ClubService } from './club.service';

@Module({
  imports: [TypeOrmModule.forFeature([Club])],
  controllers: [ClubController],
  providers: [ClubService],
})
export class ClubModule {}
