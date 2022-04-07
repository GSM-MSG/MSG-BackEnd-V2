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
    const { title, description, bannerUrl, contact, teacher, type } = {
      ...createClubData,
    };
    const club = await this.club.create({
      title,
      description,
      bannerUrl,
      contact,
      teacher,
      type,
    });
    this.club.save(club);
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
  async findMember(clubType: string, clubTitle: string, email: string) {
    const clubData = await this.club.findOne(
      { title: clubTitle, type: clubType },
      { relations: ['member', 'member.user'] },
    );
    let result = true;
    result = !clubData.member.find((member) => {
      return member.user.email === email;
    });
    if (result) {
      throw new HttpException(
        '동아리 원이 아닙니다',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    clubData.member.forEach((i, index) => {
      delete clubData.member[index].user.password;
      delete clubData.member[index].user.refreshToken;
      delete clubData.member[index].scope;
      delete clubData.member[index].id;
    });

    return clubData.member;
  }
}
