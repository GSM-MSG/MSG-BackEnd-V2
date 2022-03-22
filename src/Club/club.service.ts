import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Club } from 'src/Entities/Club.entity';
import { RelatedLink } from 'src/Entities/RelatedLink.entity';
import { Repository } from 'typeorm';
import { CreateClubDto } from './dto/createClub.dto';

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(Club) private club: Repository<Club>,
    @InjectRepository(RelatedLink) private relatedLink: Repository<RelatedLink>,
  ) {}
  async list(clubType: string) {
    if (!clubType) {
      throw new HttpException('동아리타입이 없습니다.', HttpStatus.BAD_REQUEST);
    }
    if (clubType === 'MAJOR' || 'EDITORIAL' || 'FREEDOM') {
      return this.club.find({ where: { type: clubType } });
    } else {
      throw new HttpException(
        '동아리타입이 잘못되었습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async CreateClub(createClubData: CreateClubDto) {
    const club = await this.club.findOne({
      where: { title: createClubData.title },
    });
    if (club) {
      throw new HttpException(
        '이미 존재하는 동아리 입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const clubData = {
      title: createClubData.title,
      description: createClubData.description,
      type: createClubData.Type,
      bannerUrl: createClubData.bannerUrl,
      contact: createClubData.contact,
      teacher: createClubData.teacher,
    };
    for (let i = 0; i < createClubData.relatedLink.length; i++) {
      await this.relatedLink.save({
        name: createClubData.relatedLink[i].name,
        url: createClubData.relatedLink[i].url,
      });
    }
    await this.club.save(clubData);
  }
  async DleteClub(clubtitle: string, clubType: string) {
    const club = this.club.findOne({
      where: { title: clubtitle, type: clubType },
    });
    if (!club) {
      throw new HttpException(
        '존재하지않는동아리입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (clubType === 'MAJOR' || 'EDITORIAL' || 'FREEDOM') {
      await this.club.delete({ title: clubtitle, type: clubType });
    } else {
      throw new HttpException(
        '잘못된 동아리 유형입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
