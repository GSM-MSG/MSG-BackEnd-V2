import {
  BadRequestException,
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
import { editClubdto } from './dto/editclub.dto';
import { kickUserDto } from './dto/kickuser.dto';
import { openClubdto } from './dto/openClub.dto';

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(Club) private Club: Repository<Club>,
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
  async createClub(createClubData: CreateClubDto, userId) {
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
      isOpened,
    } = {
      ...createClubData,
    };
    if (await this.Club.findOne({ title: title, type: type })) {
      throw new HttpException(
        '이미 존재하는 동아리입니다',
        HttpStatus.CONFLICT,
      );
    }
    await this.Club.save(
      this.Club.create({
        title,
        description,
        bannerUrl,
        contact,
        teacher,
        type,
      }),
    );
    const club = await this.Club.findOne({ title: title, type: type });
    if (!club) {
      throw new HttpException(
        '동아리가 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    if (relatedLink) {
      await this.RelatedLink.save(
        this.RelatedLink.create({
          name: relatedLink.name,
          url: relatedLink.url,
          club: club,
        }),
      );
    }
    const user = await this.User.findOne({ email: userId });
    await this.Member.save(
      this.Member.create({ user: user, club: club, scope: 'HEAD' }),
    );
    if (member) {
      member.forEach(async (user) => {
        const User = await this.User.findOne({ email: user });
        await this.Member.save(
          this.Member.create({ user: User, club: club, scope: 'MEMBER' }),
        );
      });
    }
    if (activityUrls) {
      activityUrls.forEach((image) => {
        this.Image.save({ clubId: club.id, url: image });
      });
    }
  }

  async deleteClub(clubtitle: string, clubType: string) {
    const club = this.Club.findOne({
      title: clubtitle,
      type: clubType,
    });
    if (!club) {
      throw new HttpException(
        '존재하지않는 동아리입니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    if (clubType === 'MAJOR' || 'EDITORIAL' || 'FREEDOM') {
      await this.Club.delete({ title: clubtitle, type: clubType });
    } else {
      throw new HttpException(
        '잘못된 동아리 유형입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async applyClub(clubtype: string, clubtitle: string, userId: string) {
    const club = await this.Club.findOne({ type: clubtype, title: clubtitle });
    const user = await this.User.findOne({ email: userId });
    if (!club) {
      throw new HttpException(
        '존재하지 않는 동아리입니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    if (!user) {
      throw new HttpException(
        '존재하지 않는 유저입니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    this.RequestJoin.save(
      this.RequestJoin.create({ clubId: club, userId: user }),
    );
  }

  async cancelClub(clubtype: string, clubtitle: string, userId: string) {
    const club = await this.Club.findOne({ type: clubtype, title: clubtitle });
    const user = await this.User.findOne({ email: userId });
    if (!club) {
      throw new HttpException(
        '존재하지않는 동아리입니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    if (!user) {
      throw new HttpException('존재하지않는 유저입니다.', HttpStatus.NOT_FOUND);
    }

    const applyUser = await this.RequestJoin.findOne({
      clubId: club,
      userId: user,
    });

    await this.RequestJoin.delete(applyUser);
  }

  async acceptClub(
    clubtype: string,
    clubtitle: string,
    acceptUserId: string,
    userId: string,
  ) {
    const club = await this.Club.findOne(
      { type: clubtype, title: clubtitle },
      { relations: ['member'] },
    );
    const user = await this.User.findOne({ email: acceptUserId });
    if (!club) {
      throw new HttpException(
        '존재하지 않는 동아리입니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    if (
      !club.member.filter((member) => {
        return member.user.email === userId && member.scope == 'HEAD';
      })
    ) {
      throw new HttpException('동아리부장이 아닙니다.', HttpStatus.FORBIDDEN);
    }
    const acceptUser = await this.RequestJoin.findOne({
      clubId: club,
      userId: user,
    });
    await this.RequestJoin.delete(acceptUser);
    this.Member.save({ club: club, email: user, scope: 'MEMBER' });
  }

  async rejectClub(
    clubtype: string,
    clubtitle: string,
    rejectUserId: string,
    userId: string,
  ) {
    const club = await this.Club.findOne({ type: clubtype, title: clubtitle });
    const user = await this.User.findOne({ email: rejectUserId });

    if (!club) {
      throw new HttpException(
        '존재하지 않는 동아리입니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    if (
      !club.member.filter((member) => {
        return member.user.email === userId && member.scope == 'HEAD';
      })
    ) {
      throw new HttpException('동아리부장이 아닙니다.', HttpStatus.FORBIDDEN);
    }
    const rejectUser = await this.RequestJoin.findOne({
      clubId: club,
      userId: user,
    });
    await this.RequestJoin.delete(rejectUser);
  }

  async applicantList(clubtype: string, clubtitle: string, userId: string) {
    const reqUserData = await this.Club.findOne(
      { title: clubtitle, type: clubtype },
      { relations: ['requestJoin', 'requestJoin.userId', 'member'] },
    );
    if (
      !reqUserData.member.find((member) => {
        return member.user.email === userId;
      })
    ) {
      throw new HttpException(
        '동아리원이 아닙니다.',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    return reqUserData.requestJoin.map((member) => {
      delete member.userId.password;
      delete member.userId.refreshToken;
      return member.userId;
    });
  }

  async detailPage(clubtype: string, clubtitle: string) {
    const club = await this.Club.findOne(
      { type: clubtype, title: clubtitle },
      { relations: ['activityUrls', 'relatedLink', 'member', 'member.user'] },
    );
    if (!club) {
      throw new HttpException(
        '존재하지않는 동아리입니다.',
        HttpStatus.NOT_FOUND,
      );
    }

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
        return member.user;
      });
    const activityurls = club.activityUrls.map((url) => {
      return url.url;
    });
    delete club.relatedLink[0].id;
    delete club.member;
    delete club.activityUrls;
    delete club.id;

    return { club, activityurls, head: head[0].user, member: clubmember };
  }
  async findMember(clubType: string, clubTitle: string, email: string) {
    const clubData = await this.Club.findOne(
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
    const clubData = await this.Club.findOne(
      { title: openClubData.q, type: openClubData.type },
      { relations: ['member', 'member.user'] },
    );
    if (
      !clubData.member.find((member) => {
        return member.user.email === email && member.scope === 'HEAD';
      })
    )
      throw new HttpException('동아리 부장이 아닙니다', HttpStatus.FORBIDDEN);
    await this.Club.update(
      { title: openClubData.q, type: openClubData.type },
      { isOpened: isOpened },
    );
  }
  async kickUser(kickUserData: kickUserDto, email: string) {
    const clubData = await this.Club.findOne(
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
    const clubData = await this.Club.findOne(
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
    const member = clubData.member.find((member) => {
      return member.user.email === userData.userId;
    });
    if (!member)
      throw new HttpException('멤버가 없습니다', HttpStatus.NOT_FOUND);
    await this.Member.update(
      { club: clubData, user: member.user },
      { scope: 'HEAD' },
    );
    const headMember = clubData.member.find((member) => {
      return member.user.email === email;
    });
    await this.Member.update(
      { club: clubData, user: headMember.user },
      { scope: 'MEMBER' },
    );
  }
  async editClub(editClubData: editClubdto) {
    const {
      new_activityUrls,
      new_member,
      delete_activityUrls,
      delete_member,
      relatedLink,
    } = editClubData;
    const club = await this.Club.findOne(
      {
        title: editClubData.q,
        type: editClubData.type,
      },
      { relations: ['relatedLink'] },
    );

    if (!club) {
      throw new HttpException(
        '존재하지 않는 동아리입니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    if (relatedLink) {
      if (!club.relatedLink) {
        await this.RelatedLink.save(
          this.RelatedLink.create({
            name: relatedLink.name,
            url: relatedLink.url,
            club: club,
          }),
        );
      } else {
        await this.RelatedLink.update(
          { club: club },
          { url: relatedLink.url, name: relatedLink.name },
        );
      }
    }
    if (new_member) {
      for (const email of new_member) {
        const user = await this.User.findOne({ email: email });
        const clubmember = await this.Member.findOne({
          user: user,
          club: club,
        });
        if (!user) {
          throw new HttpException(
            '존재하지 않는 유저입니다.',
            HttpStatus.NOT_FOUND,
          );
        } else if (clubmember) {
          throw new HttpException(
            '동아리에 이미 있는 유저입니다.',
            HttpStatus.CONFLICT,
          );
        }
        await this.Member.save(
          this.Member.create({ user: user, club: club, scope: 'MEMBER' }),
        );
      }
    }
    await this.Club.update(
      { title: editClubData.q, type: editClubData.type },
      {
        title: editClubData.title,
        description: editClubData.description,
        bannerUrl: editClubData.bannerUrl,
        contact: editClubData.contact,
        teacher: editClubData.teacher,
      },
    );
  }
}
