import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Club } from 'src/Entities/Club.entity';
import { Member } from 'src/Entities/Member.entity';
import { RelatedLink } from 'src/Entities/RelatedLink.entity';
import { User } from 'src/Entities/User.entity';
import { ClubController } from './club.controller';
import { ClubService } from './club.service';
import { Image } from 'src/Entities/image.entity';
import { RequestJoin } from 'src/Entities/RequestJoin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Club,
      RelatedLink,
      Member,
      User,
      Image,
      RequestJoin,
    ]),
  ],
  controllers: [ClubController],
  providers: [ClubService],
})
export class ClubModule {}
