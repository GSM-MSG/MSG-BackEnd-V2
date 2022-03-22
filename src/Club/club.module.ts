import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Club } from 'src/Entities/Club.entity';
import { RelatedLink } from 'src/Entities/RelatedLink.entity';
import { ClubController } from './club.controller';
import { ClubService } from './club.service';

@Module({
  imports: [TypeOrmModule.forFeature([Club, RelatedLink])],
  controllers: [ClubController],
  providers: [ClubService],
})
export class ClubModule {}
