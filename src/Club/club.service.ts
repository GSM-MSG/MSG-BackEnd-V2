import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Club } from 'src/Entities/Club.entity';
import { Image } from 'src/Entities/image.entity';
import { Member } from 'src/Entities/Member.entity';
import { RelatedLink } from 'src/Entities/RelatedLink.entity';
import { RequestJoin } from 'src/Entities/RequestJoin.entity';
import { User } from 'src/Entities/User.entity';
import { Repository } from 'typeorm';
import { CreateClubDto } from './dto/createClub.dto';
import { EditClubDto } from './dto/editclub.dto';
import { KickUserDto } from './dto/kickUser.dto';
import { ClubDataDto } from './dto/ClubData.dto';

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
  async createClub(createClubData: CreateClubDto, email: string) {
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
    } = createClubData;
    if (await this.Club.findOne({ where: { title: title, type: type } })) {
      throw new HttpException(
        '이미 존재하는 동아리입니다',
        HttpStatus.CONFLICT,
      );
    }
    if (!email) {
      throw new HttpException(
        '이메일이 존재하지 않습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    let isOpened = false;
    await this.Club.save(
      this.Club.create({
        title,
        description,
        bannerUrl,
        contact,
        teacher,
        type,
        isOpened: isOpened,
      }),
    );
    const clubData = await this.Club.findOne({
      where: { title: title, type: type },
    });
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
    const userData = await this.User.findOne({ where: { email } });
    await this.Member.save(
      this.Member.create({ user: userData, club: clubData, scope: 'HEAD' }),
    );
    if (member) {
      member.forEach(async (user) => {
        const userData = await this.User.findOne({ where: { email: user } });
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
    const clubData = await this.Club.findOne({
      where: { title: clubtitle, type: clubType },
      relations: ['member', 'member.user'],
    });
    if (
      !clubData.member.find((member) => {
        return member.user.email === email && member.scope === 'HEAD';
      })
    ) {
      throw new HttpException('동아리 부장이 아닙니다.', HttpStatus.FORBIDDEN);
    }
    if (!email) {
      throw new HttpException(
        '이메일이 존재하지 않습니다.',
        HttpStatus.UNAUTHORIZED,
      );
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

  async applyClub(clubtype: string, clubtitle: string, email: string) {
    const clubData = await this.Club.findOne({
      where: { type: clubtype, title: clubtitle },
    });
    if (!email) {
      throw new HttpException(
        '이메일이 존재하지 않습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const userData = await this.User.findOne({ where: { email } });
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

  async cancelClub(clubtype: string, clubtitle: string, email: string) {
    const clubData = await this.Club.findOne({
      where: { type: clubtype, title: clubtitle },
    });
    const userData = await this.User.findOne({ where: { email } });
    if (!email) {
      throw new HttpException(
        '이메일이 존재하지 않습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }
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
      where: { clubId: clubData, userId: userData },
    });

    await this.RequestJoin.delete({ ...applyUser });
  }

  async acceptClub(
    clubtype: string,
    clubtitle: string,
    acceptUserId: string,
    userId: string,
  ) {
    const clubData = await this.Club.findOne({
      where: { type: clubtype, title: clubtitle },
      relations: ['member'],
    });
    const userData = await this.User.findOne({
      where: { email: acceptUserId },
    });
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
      where: { clubId: clubData, userId: userData },
    });
    await this.RequestJoin.delete(acceptUser);
    this.Member.save({ club: clubData, email: userData, scope: 'MEMBER' });
  }

  async rejectClub(
    clubtype: string,
    clubtitle: string,
    rejectUserId: string,
    email: string,
  ) {
    const clubData = await this.Club.findOne({
      where: { type: clubtype, title: clubtitle },
    });
    const userData = await this.User.findOne({
      where: { email: rejectUserId },
    });

    if (!email) {
      throw new HttpException(
        '이메일이 존재하지 않습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!clubData) {
      throw new HttpException(
        '존재하지 않는 동아리입니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    if (
      !clubData.member.filter((member) => {
        return member.user.email === email && member.scope == 'HEAD';
      })
    ) {
      throw new HttpException('동아리부장이 아닙니다.', HttpStatus.FORBIDDEN);
    }
    const rejectUser = await this.RequestJoin.findOne({
      where: { clubId: clubData, userId: userData },
    });
    await this.RequestJoin.delete({ ...rejectUser });
  }

  async applicantList(clubType: string, clubtitle: string, email: string) {
    const reqUserData = await this.Club.findOne({
      relations: ['requestJoin', 'requestJoin.userId', 'member', 'member.user'],
      where: { title: clubtitle, type: clubType },
    });
    if (!email) {
      throw new HttpException(
        '이메일이 존재하지 않습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    if (!reqUserData) {
      throw new HttpException(
        '동아리가 존재하지 않습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    if (
      !reqUserData.member.find((member) => {
        return member.user.email === email;
      })
    ) {
      throw new HttpException(
        '동아리원이 아닙니다.',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    return reqUserData.requestJoin.map((member) => {
      delete member.userId.refreshToken;
      return member.userId;
    });
  }

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
        relatedLink: { name: true, url: true, id: true },
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

  async detailPage(clubtype: string, clubtitle: string, email: string) {
    const club = await this.Club.findOne({
      where: { type: clubtype, title: clubtitle },
      relations: ['activityUrls', 'relatedLink', 'member', 'member.user'],
      select: {
        id: true,
        title: true,
        type: true,
        bannerUrl: true,
        description: true,
        contact: true,
        teacher: true,
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
        relatedLink: { name: true, url: true, id: true },
        activityUrls: { id: true, url: true },
      },
    });
    if (!email) {
      throw new HttpException(
        '이메일이 존재하지 않습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const userData = await this.User.findOne({ where: { email } });
    if (!club) {
      throw new HttpException(
        '존재하지않는 동아리입니다.',
        HttpStatus.NOT_FOUND,
      );
    }

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
      const applicant = await this.RequestJoin.findOne({
        where: { userId: userData, clubId: club },
      });
      const isApplied = !!applicant;
      const memberForScope = club.member.find((member) => {
        return member.user === userData;
      });
      const scope = memberForScope ? memberForScope.scope : 'USER';

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
  async findMember(clubType: string, clubTitle: string, email: string) {
    const clubData = await this.Club.findOne({
      where: { title: clubTitle, type: clubType },
      relations: ['member', 'member.user'],
    });
    if (!email) {
      throw new HttpException(
        '이메일이 존재하지 않습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }
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
      delete member.user.refreshToken;
      return member;
    });
  }
  async clubOnOff(openClubData: ClubDataDto, email: string, isOpened: boolean) {
    const clubData = await this.Club.findOne({
      where: { title: openClubData.q, type: openClubData.type },
      relations: ['member', 'member.user'],
    });
    if (!email) {
      throw new HttpException(
        '이메일이 존재하지 않습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }
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
  async kickUser(kickUserData: KickUserDto, email: string) {
    const clubData = await this.Club.findOne({
      where: { title: kickUserData.q, type: kickUserData.type },
      relations: ['member', 'member.user'],
    });
    if (!email) {
      throw new HttpException(
        '이메일이 존재하지 않습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }
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
      where: { email: kickUserData.userId },
    });
    if (
      !clubData.member.find((member) => {
        return member.user.email === email && member.scope === 'HEAD';
      })
    )
      throw new HttpException('동아리 부장이 아닙니다', HttpStatus.FORBIDDEN);
    await this.Member.delete({ club: clubData, user: userData });
  }
  async delegation(userData: KickUserDto, email: string) {
    const clubData = await this.Club.findOne({
      where: {
        title: userData.q,
        type: userData.type,
      },
      relations: ['member', 'member.user'],
    });
    if (!email) {
      throw new HttpException(
        '이메일이 존재하지 않습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }
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
  async editClub(editClubData: EditClubDto, email: string) {
    const {
      newActivityUrls,
      newMember,
      deleteActivityUrls,
      deleteMember,
      relatedLink,
    } = editClubData;
    const clubData = await this.Club.findOne({
      where: {
        title: editClubData.q,
        type: editClubData.type,
      },
      relations: ['relatedLink', 'member', 'member.user'],
    });
    if (!email) {
      throw new HttpException(
        '이메일이 존재하지 않습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }

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
        const userData = await this.User.findOne({ where: { email } });
        const clubMemberData = await this.Member.findOne({
          where: { user: userData, club: clubData },
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
        const userData = await this.User.findOne({ where: { email } });
        const clubmember = await this.Member.findOne({
          where: { user: userData, club: clubData },
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
          where: { clubId: clubData.id, url: image },
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
            where: { clubId: clubData.id, url: image },
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
