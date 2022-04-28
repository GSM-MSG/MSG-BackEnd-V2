import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Club } from 'src/Entities/Club.entity';
import { Image } from 'src/Entities/image.entity';
import { Member } from 'src/Entities/Member.entity';
import { RelatedLink } from 'src/Entities/RelatedLink.entity';
import { RequestJoin } from 'src/Entities/RequestJoin.entity';
import { User } from 'src/Entities/User.entity';
import { Repository } from 'typeorm';
import { ClubDatadto } from './dto/clubData.dto';
import { CreateClubDto } from './dto/createClub.dto';
import { editClubdto } from './dto/editclub.dto';
import { kickUserDto } from './dto/kickuser.dto';

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
    const clubData = await this.Club.findOne({ title: title, type: type });
    if (!clubData) {
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
          club: clubData,
        }),
      );
    }
    const userData = await this.User.findOne({ email: userId });
    await this.Member.save(
      this.Member.create({ user: userData, club: clubData, scope: 'HEAD' }),
    );
    if (member) {
      member.forEach(async (user) => {
        const userData = await this.User.findOne({ email: user });
        await this.Member.save(
          this.Member.create({
            user: userData,
            club: clubData,
            scope: 'MEMBER',
          }),
        );
      });
    }
    if (activityUrls) {
      activityUrls.forEach((image) => {
        this.Image.save({ clubId: clubData.id, url: image });
      });
    }
  }

  async deleteClub(clubtitle: string, clubType: string, email: string) {
    const clubData = await this.Club.findOne(
      {
        title: clubtitle,
        type: clubType,
      },
      { relations: ['member', 'member.user'] },
    );
    if (
      !clubData.member.find((member) => {
        return member.user.email === email && member.scope === 'HEAD';
      })
    ) {
      throw new HttpException('동아리 부장이 아닙니다.', HttpStatus.FORBIDDEN);
    }
    if (!clubData) {
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
    const clubData = await this.Club.findOne({
      type: clubtype,
      title: clubtitle,
    });
    const userData = await this.User.findOne({ email: userId });
    if (!clubData) {
      throw new HttpException(
        '존재하지 않는 동아리입니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    if (!userData) {
      throw new HttpException(
        '존재하지 않는 유저입니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    this.RequestJoin.save(
      this.RequestJoin.create({ clubId: clubData, userId: userData }),
    );
  }

  async cancelClub(clubtype: string, clubtitle: string, userId: string) {
    const clubData = await this.Club.findOne({
      type: clubtype,
      title: clubtitle,
    });
    const userData = await this.User.findOne({ email: userId });
    if (!clubData) {
      throw new HttpException(
        '존재하지않는 동아리입니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    if (!userData) {
      throw new HttpException('존재하지않는 유저입니다.', HttpStatus.NOT_FOUND);
    }

    const applyUser = await this.RequestJoin.findOne({
      clubId: clubData,
      userId: userData,
    });

    await this.RequestJoin.delete(applyUser);
  }

  async acceptClub(
    clubtype: string,
    clubtitle: string,
    acceptUserId: string,
    userId: string,
  ) {
    const clubData = await this.Club.findOne(
      { type: clubtype, title: clubtitle },
      { relations: ['member'] },
    );
    const userData = await this.User.findOne({ email: acceptUserId });
    if (!clubData) {
      throw new HttpException(
        '존재하지 않는 동아리입니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    if (
      !clubData.member.filter((member) => {
        return member.user.email === userId && member.scope == 'HEAD';
      })
    ) {
      throw new HttpException('동아리부장이 아닙니다.', HttpStatus.FORBIDDEN);
    }
    const acceptUser = await this.RequestJoin.findOne({
      clubId: clubData,
      userId: userData,
    });
    await this.RequestJoin.delete(acceptUser);
    this.Member.save({ club: clubData, email: userData, scope: 'MEMBER' });
  }

  async rejectClub(
    clubtype: string,
    clubtitle: string,
    rejectUserId: string,
    userId: string,
  ) {
    const clubData = await this.Club.findOne({
      type: clubtype,
      title: clubtitle,
    });
    const userData = await this.User.findOne({ email: rejectUserId });

    if (!clubData) {
      throw new HttpException(
        '존재하지 않는 동아리입니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    if (
      !clubData.member.filter((member) => {
        return member.user.email === userId && member.scope == 'HEAD';
      })
    ) {
      throw new HttpException('동아리부장이 아닙니다.', HttpStatus.FORBIDDEN);
    }
    const rejectUser = await this.RequestJoin.findOne({
      clubId: clubData,
      userId: userData,
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
    const clubData = await this.Club.findOne(
      { type: clubtype, title: clubtitle },
      { relations: ['activityUrls', 'relatedLink', 'member', 'member.user'] },
    );
    if (!clubData) {
      throw new HttpException(
        '존재하지않는 동아리입니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    const head = clubData.member
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

    const clubmember = clubData.member
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
    const activityurls = clubData.activityUrls.map((url) => {
      return url.url;
    });
    delete clubData.relatedLink[0].id;
    delete clubData.member;
    delete clubData.activityUrls;
    delete clubData.id;

    return { clubData, activityurls, head: head[0].user, member: clubmember };
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
  async clubOnOff(openClubData: ClubDatadto, email: string, isOpened: boolean) {
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
  async editClub(editClubData: editClubdto, email: string) {
    const {
      newActivityUrls,
      newMember,
      deleteActivityUrls,
      deleteMember,
      relatedLink,
    } = editClubData;
    const clubData = await this.Club.findOne(
      {
        title: editClubData.q,
        type: editClubData.type,
      },
      { relations: ['relatedLink', 'member', 'member.user'] },
    );

    if (!clubData) {
      throw new HttpException(
        '존재하지 않는 동아리입니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    if (
      !clubData.member.find((member) => {
        return member.user.email === email && member.scope === 'HEAD';
      })
    ) {
      throw new HttpException('동아리 부장이 아닙니다.', HttpStatus.FORBIDDEN);
    }
    if (relatedLink) {
      if (!clubData.relatedLink) {
        await this.RelatedLink.save(
          this.RelatedLink.create({
            name: relatedLink.name,
            url: relatedLink.url,
            club: clubData,
          }),
        );
      } else {
        await this.RelatedLink.update(
          { club: clubData },
          { url: relatedLink.url, name: relatedLink.name },
        );
      }
    }
    if (newMember) {
      for (const email of newMember) {
        const userData = await this.User.findOne({ email: email });
        const clubMemberData = await this.Member.findOne({
          user: userData,
          club: clubData,
        });
        if (!userData) {
          throw new HttpException(
            '존재하지 않는 유저입니다.',
            HttpStatus.NOT_FOUND,
          );
        } else if (clubMemberData) {
          throw new HttpException(
            '동아리에 이미 있는 유저입니다.',
            HttpStatus.CONFLICT,
          );
        }
        await this.Member.save({
          user: userData,
          club: clubData,
          scope: 'MEMBER',
        });
      }
    }
    if (deleteMember) {
      for (const email of deleteMember) {
        const userData = await this.User.findOne({ email: email });
        const clubmember = await this.Member.findOne({
          user: userData,
          club: clubData,
        });
        if (!userData) {
          throw new HttpException(
            '존재하지 않는 유저입니다.',
            HttpStatus.NOT_FOUND,
          );
        } else if (!clubmember) {
          throw new HttpException(
            '동아리에 존재하지 않는 유저입니다.',
            HttpStatus.CONFLICT,
          );
        }
        await this.Member.delete({ user: userData });
      }
    }
    if (newActivityUrls) {
      for (const image of newActivityUrls) {
        const clubImage = await this.Image.findOne({
          clubId: clubData.id,
          url: image,
        });
        if (clubImage) {
          throw new HttpException(
            '동아리에 존재하는 이미지입니다.',
            HttpStatus.CONFLICT,
          );
        }
        await this.Image.save(
          this.Image.create({ url: image, clubId: clubData.id }),
        );
      }
      if (deleteActivityUrls) {
        for (const image of deleteActivityUrls) {
          const clubImageData = await this.Image.findOne({
            clubId: clubData.id,
            url: image,
          });
          if (!clubImageData) {
            throw new HttpException(
              '동아리에 존재하지 않는 이미지입니다.',
              HttpStatus.CONFLICT,
            );
          }
          await this.Image.delete({ url: image, clubId: clubData.id });
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
}
