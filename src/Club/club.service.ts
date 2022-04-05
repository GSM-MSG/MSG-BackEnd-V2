import {
  ConsoleLogger,
  Head,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Club } from 'src/Entities/Club.entity';
import { Image } from 'src/Entities/image.entity';
import { Member } from 'src/Entities/Member.entity';
import { RelatedLink } from 'src/Entities/RelatedLink.entity';
import { RequestJoin } from 'src/Entities/RequestJoin.entity';
import { User } from 'src/Entities/User.entity';
import { Repository } from 'typeorm';
import { CreateClubDto } from './dto/createClub.dto';

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(Club) private club: Repository<Club>,
    @InjectRepository(RelatedLink) private RelatedLink: Repository<RelatedLink>,
    @InjectRepository(Member) private Member: Repository<Member>,
    @InjectRepository(User) private User: Repository<User>,
    @InjectRepository(Image) private Image: Repository<Image>,
    @InjectRepository(RequestJoin) private RequestJoin: Repository<RequestJoin>,
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
  async CreateClub(createClubData: CreateClubDto, userId) {
    const {
      title,
      description,
      bannerUrl,
      contact,
      teacher,
      type,
      relatedLink,
      member,
      activityUrls,
    } = {
      ...createClubData,
    };
    await this.club.save(
      this.club.create({
        title,
        description,
        bannerUrl,
        contact,
        teacher,
        type,
      }),
    );
    const club = await this.club.findOne({ title: title, type: type });
    console.log(club);

    await this.RelatedLink.save(
      this.RelatedLink.create({
        name: relatedLink.name,
        url: relatedLink.url,
        club: club,
      }),
    );

    const user = await this.User.findOne({ email: userId });
    await this.Member.save(
      this.Member.create({ email: user, club: club, scope: 'HEAD' }),
    );
    member.forEach(async (user) => {
      console.log(userId);
      const User = await this.User.findOne({ email: user });
      console.log(User);
      await this.Member.save(
        this.Member.create({ email: User, club: club, scope: 'MEMBER' }),
      );
    });

    activityUrls.forEach((image) => {
      this.Image.save({ clubId: club.id, url: image });
    });
  }
  async DeleteClub(clubtitle: string, clubType: string) {
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
  async applyClub(clubtype: string, clubname: string, userId: string) {
    const club = await this.club.findOne({ type: clubtype, title: clubname });
    const user = await this.User.findOne({ email: userId });
    const ReqUser = this.RequestJoin.create({ clubId: club, userId: user });
    this.RequestJoin.save(ReqUser);
  }
  async cancleClub(clubtype: string, clubname: string, userId: string) {
    const club = await this.club.findOne({ type: clubtype, title: clubname });
    const user = await this.User.findOne({ email: userId });

    const applyUser = await this.RequestJoin.findOne({
      clubId: club,
      userId: user,
    });

    await this.RequestJoin.delete(applyUser);
  }
  async acceptClub(clubtype: string, clubname: string, userId: string) {
    const club = await this.club.findOne({ type: clubtype, title: clubname });
    const user = await this.User.findOne({ email: userId });

    const acceptUser = await this.RequestJoin.findOne({
      clubId: club,
      userId: user,
    });
    await this.RequestJoin.delete(acceptUser);
    this.Member.save({ club: club, email: user, scope: 'MEMBER' });
  }
  async rejectClub(clubtype: string, clubname: string, userId: string) {
    const club = await this.club.findOne({ type: clubtype, title: clubname });
    const user = await this.User.findOne({ email: userId });

    const rejectUser = await this.RequestJoin.findOne({
      clubId: club,
      userId: user,
    });
    await this.RequestJoin.delete(rejectUser);
  }
  async applicantList(clubtype: string, clubname: string) {
    let list = new Array();
    const club = await this.club.findOne({ type: clubtype, title: clubname });
    const applicantUser = await this.RequestJoin.createQueryBuilder('Join')
      .innerJoin('Join.clubId', 'userId')
      .where('Join.clubId=:clubId', { clubId: club.id })
      .getRawMany();
    for (let i = 0; i < applicantUser.length; i++) {
      const user = await this.User.findOne({
        email: applicantUser[i].Join_userIdEmail,
      });
      list.push(user);
    }
    return list;
  }
  async detailPage(clubtype: string, clubname: string) {
    let HeadData = {};
    let Member = [];
    const club = await this.club.findOne({ type: clubtype, title: clubname });
    const clubMember = await this.Member.createQueryBuilder('member')
      .innerJoin('member.club', 'userId')
      .where('member.club=:club', { club: club.id })
      .getRawMany();
    for (let i = 0; i < clubMember.length; i++) {
      if (clubMember[i].member_scope === 'HEAD') {
        const head = await this.User.findOne({
          email: clubMember[i].member_emailEmail,
        });
        HeadData = head;
      }
      if (clubMember[i].member_scope === 'MEMBER') {
        const member = await this.User.findOne({
          email: clubMember[i].member_emailEmail,
        });
        Member.push(member);
      }
    }
    const relatedlink = await this.RelatedLink.findOne({ club: club });

    const activityUrls = (await this.Image.find({ clubId: club.id })).map(
      (value: Image, index: number): String => value.url,
    );

    return {
      club,
      head: HeadData,
      member: Member,
      relatedLink: relatedlink,
      activityUrls: activityUrls,
    };
  }
}
