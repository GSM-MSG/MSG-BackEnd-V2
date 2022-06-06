import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Club } from 'src/Entities/Club.entity';
import { User } from 'src/Entities/User.entity';
import { Image } from 'src/Entities/image.entity';
import { Member } from 'src/Entities/Member.entity';
import { RequestJoin } from 'src/Entities/RequestJoin.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GuestService {
  constructor(
    @InjectRepository(Club) private Club: Repository<Club>,
    @InjectRepository(Member) private Member: Repository<Member>,
    @InjectRepository(User) private User: Repository<User>,
    @InjectRepository(Image) private Image: Repository<Image>,
    @InjectRepository(RequestJoin) private RequestJoin: Repository<RequestJoin>,
  ) {}

  async guestDetailPage(clubType: string, clubName: string) {
    const club = await this.Club.findOne({
      where: { type: clubType, title: clubName },
      relations: ['activityUrls', 'relatedLink', 'member', 'member.user'],
      select: {
        id: true,
        title: true,
        type: true,
        bannerUrl: true,
        description: true,
        contact: true,
        teacher: true,
        relatedLink: true,
        isOpened: true,
        member: {
          id: true,
          user: {
            email: true,
            name: true,
            grade: true,
            class: true,
            num: true,
            userImg: true,
          },
          scope: true,
        },
        activityUrls: { id: true, url: true },
      },
    });

    if (!club)
      throw new HttpException(
        '존재하지 않는 동아리입니다.',
        HttpStatus.NOT_FOUND,
      );
    const head = club.member.find((member) => {
      return member.scope === 'HEAD';
    });

    const clubMembers = club.member.filter((member) => {
      return member.scope === 'MEMBER';
    });

    if (club.activityUrls) {
      const activityurls = club.activityUrls.map((url) => {
        return url.url;
      });
      const isApplied = false;
      const scope = 'USER';

      delete club.member;
      delete club.activityUrls;

      return {
        club,
        activityurls,
        head: head.user,
        member: clubMembers.map((user) => {
          return user.user;
        }),
        scope,
        isApplied,
      };
    }
  }

  async list(clubType: string) {
    if (!clubType) {
      throw new HttpException('동아리타입이 없습니다.', HttpStatus.BAD_REQUEST);
    }
    if (clubType === 'MAJOR' || 'EDITORIAL' || 'FREEDOM') {
      const clubData = await this.Club.find({
        where: { type: clubType },
        select: ['type', 'title', 'bannerUrl'],
      });
      return clubData;
    } else {
      throw new HttpException(
        '동아리타입이 잘못되었습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
