import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Club } from 'src/Entities/Club.entity';
import { Image } from 'src/Entities/image.entity';
import { Member } from 'src/Entities/Member.entity';
import { RelatedLink } from 'src/Entities/RelatedLink.entity';
import { RequestJoin } from 'src/Entities/RequestJoin.entity';
import { User } from 'src/Entities/User.entity';
import { Not, Repository } from 'typeorm';
import { CreateClubDto } from './dto/createClub.dto';
import { kickUserDto } from './dto/kickuser.dto';
import { openClubdto } from './dto/openClub.dto';

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
    if (await this.club.findOne({ title: title, type: type })) {
      throw new HttpException(
        '이미 존재하는 동아리입니다',
        HttpStatus.CONFLICT,
      );
    }
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

    await this.RelatedLink.save(
      this.RelatedLink.create({
        name: relatedLink.name,
        url: relatedLink.url,
        club: club,
      }),
    );
    const user = await this.User.findOne({ email: userId });
    await this.Member.save(
      this.Member.create({ user: user, club: club, scope: 'HEAD' }),
    );
    member.forEach(async (user) => {
      const User = await this.User.findOne({ email: user });
      await this.Member.save(
        this.Member.create({ user: User, club: club, scope: 'MEMBER' }),
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

  async applyClub(clubtype: string, clubtitle: string, userId: string) {
    const club = await this.club.findOne({ type: clubtype, title: clubtitle });
    const user = await this.User.findOne({ email: userId });
    const ReqUser = this.RequestJoin.create({ clubId: club, userId: user });
    this.RequestJoin.save(ReqUser);
  }
  async cancelClub(clubtype: string, clubtitle: string, userId: string) {
    const club = await this.club.findOne({ type: clubtype, title: clubtitle });
    const user = await this.User.findOne({ email: userId });

    const applyUser = await this.RequestJoin.findOne({
      clubId: club,
      userId: user,
    });

    await this.RequestJoin.delete(applyUser);
  }
  async acceptClub(clubtype: string, clubtitle: string, userId: string) {
    const club = await this.club.findOne({ type: clubtype, title: clubtitle });
    const user = await this.User.findOne({ email: userId });

    const acceptUser = await this.RequestJoin.findOne({
      clubId: club,
      userId: user,
    });
    await this.RequestJoin.delete(acceptUser);
    this.Member.save({ club: club, email: user, scope: 'MEMBER' });
  }
  async rejectClub(clubtype: string, clubtitle: string, userId: string) {
    const club = await this.club.findOne({ type: clubtype, title: clubtitle });
    const user = await this.User.findOne({ email: userId });

    const rejectUser = await this.RequestJoin.findOne({
      clubId: club,
      userId: user,
    });
    await this.RequestJoin.delete(rejectUser);
  }
  async applicantList(clubtype: string, clubtitle: string) {
    const ReqUserData = await this.club.findOne(
      { title: clubtitle, type: clubtype },
      { relations: ['requestJoin', 'requestJoin.userId'] },
    );

    return ReqUserData.requestJoin.map((member) => {
      delete member.userId.password;
      delete member.userId.refreshToken;
      return member.userId;
    });
  }
  async detailPage(clubtype: string, clubtitle: string) {
    const club = await this.club.findOne(
      { type: clubtype, title: clubtitle },
      { relations: ['activityUrls', 'relatedLink', 'member', 'member.user'] },
    );
    const head = club.member
      .filter((member) => {
        return member.scope === 'HEAD';
      })
      .map((member) => {
        delete member.user.password;
        delete member.id;
        delete member.scope;
        delete member.user.refreshToken;
        return member;
      });

    const clubmember = club.member
      .filter((member) => {
        return member.scope === 'MEMBER';
      })
      .map((member) => {
        delete member.user.password;
        delete member.id;
        delete member.scope;
        delete member.user.refreshToken;
        return member;
      });

    delete club.member;

    return { club, head: head[0], member: clubmember };
  }
  async findMember(clubType: string, clubTitle: string, email: string) {
    const clubData = await this.club.findOne(
      { title: clubTitle, type: clubType },
      { relations: ['member', 'member.user'] },
    );
    if (
      !clubData.member.find((member) => {
        return member.user.email === email;
      })
    ) {
      throw new HttpException(
        '동아리 원이 아닙니다',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    return clubData.member.map((member) => {
      delete member.user.password;
      delete member.user.refreshToken;
      return member;
    });
  }
  async clubOnOff(openClubData: openClubdto, email: string, isOpened: boolean) {
    const clubData = await this.club.findOne(
      { title: openClubData.q, type: openClubData.type },
      { relations: ['member', 'member.user'] },
    );
    if (
      !clubData.member.find((member) => {
        return member.user.email === email && member.scope === 'HEAD';
      })
    )
      throw new HttpException('동아리 부장이 아닙니다', HttpStatus.FORBIDDEN);
    await this.club.update(
      { title: openClubData.q, type: openClubData.type },
      { isOpened: isOpened },
    );
  }
  async kickUser(kickUserData: kickUserDto, email: string) {
    const clubData = await this.club.findOne(
      { title: kickUserData.q, type: kickUserData.type },
      { relations: ['member', 'member.user'] },
    );
    if (
      clubData.member.find((member) => {
        return (
          member.user.email === kickUserData.userId && member.scope === 'HEAD'
        );
      })
    )
      throw new HttpException(
        '부장은 자기 자신을 방출 할 수 없습니다',
        HttpStatus.FORBIDDEN,
      );
    const userData = await this.User.findOne({
      email: kickUserData.userId,
    });
    if (
      !clubData.member.find((member) => {
        return member.user.email === email && member.scope === 'HEAD';
      })
    )
      throw new HttpException('동아리 부장이 아닙니다', HttpStatus.FORBIDDEN);
    await this.Member.delete({ club: clubData, user: userData });
  }
  async delegation(userData: kickUserDto, email: string) {
    const clubData = await this.club.findOne(
      {
        title: userData.q,
        type: userData.type,
      },
      { relations: ['member', 'member.user'] },
    );
    if (
      !clubData.member.find((member) => {
        return member.user.email === email && member.scope === 'HEAD';
      })
    )
      throw new HttpException('동아리 부장이 아닙니다', HttpStatus.FORBIDDEN);
    if (
      !clubData.member.find((member) => {
        return member.user.email === userData.userId;
      })
    )
      throw new HttpException('멤버가 없습니다', HttpStatus.NOT_FOUND);
    const userDelegationData = await this.User.findOne(
      { email: userData.userId },
      { relations: ['member', 'member.user'] },
    );
    await this.Member.update(
      { club: clubData, user: userDelegationData },
      { scope: 'HEAD' },
    );
    const userHeaderData = await this.User.findOne(
      { email: email },
      { relations: ['member', 'member.user'] },
    );
    await this.Member.update(
      { club: clubData, user: userHeaderData },
      { scope: 'MEMBER' },
    );
  }
}
