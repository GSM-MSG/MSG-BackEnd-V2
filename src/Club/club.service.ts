import {
  HttpException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Club } from 'src/Entities/Club.entity';
import { Image } from 'src/Entities/image.entity';
import { Member } from 'src/Entities/Member.entity';
import { RequestJoin } from 'src/Entities/RequestJoin.entity';
import { User } from 'src/Entities/User.entity';
import { Repository } from 'typeorm';
import { CreateClubDto } from './dto/createClub.dto';
import { EditClubDto } from './dto/editclub.dto';
import { KickUserDto } from './dto/kickuser.dto';
import { ClubDataDto } from './dto/ClubData.dto';

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(Club) private Club: Repository<Club>,
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
      notionLink,
      member,
      activityUrls,
    } = createClubData;
    const userData = await this.User.findOne({
      where: { email },
    });
    const checkUser = await this.Member.find({
      where: { user: userData },
      relations: ['club'],
    });
    if (await this.Club.findOne({ where: { title: title, type: type } })) {
      throw new HttpException(
        '이미 존재하는 동아리입니다',
        HttpStatus.CONFLICT,
      );
    }
    const check = checkUser.filter((member) => {
      return member.club.type === type;
    });
    if (check[0]) {
      throw new HttpException(
        '이미 동아리를 만든 유저입니다.',
        HttpStatus.BAD_REQUEST,
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
        notionLink,
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
    await this.Member.save(
      this.Member.create({ user: userData, club: clubData, scope: 'HEAD' }),
    );
    if (member) {
      member.forEach(async (user) => {
        const userData = await this.User.findOne({ where: { email: user } });
        const checkMember = await this.Member.find({
          where: { user: userData },
          relations: ['club'],
        });
        const check = checkMember.filter((member) => {
          return member.club.type === type;
        });
        if (!check) {
          await this.Member.save(
            this.Member.create({
              user: userData,
              club: clubData,
              scope: 'MEMBER',
            }),
          );
        }
      });
    }
    if (activityUrls) {
      activityUrls.forEach((image) => {
        this.Image.save({ club: clubData.id, url: image });
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

  async applyClub(type: string, title: string, email: string) {
    const clubData = await this.Club.findOne({
      where: { type: type, title: title },
    });
    if (!clubData) {
      throw new HttpException(
        '존재하지 않는 동아리입니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    const userData = await this.User.findOne({
      where: { email },
      relations: ['requestJoin', 'requestJoin.club', 'member', 'member.club'],
    });
    if (!userData) {
      throw new HttpException(
        '존재하지 않는 유저입니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    const checkApply = await this.RequestJoin.findOne({
      where: { user: userData, club: clubData },
    });
    if (checkApply) {
      throw new HttpException(
        '이미 이 동아리에 가입신청을 하였습니다.',
        HttpStatus.CONFLICT,
      );
    }
    if (userData.member[0]) {
      const findOthers = userData.member.filter((member) => {
        return member.club === clubData;
      });
    }
    const filterCheck = userData.requestJoin.filter((member) => {
      return member.club.type === 'MAJOR' || member.club.type === 'FREEDOM';
    });
    if (filterCheck[0] && type !== 'EDITORIAL') {
      throw new HttpException(
        '이미 다른 동아리에 지원한 상태입니다.',
        HttpStatus.CONFLICT,
      );
    }
    this.RequestJoin.save(
      this.RequestJoin.create({ club: clubData, user: userData }),
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
      where: { club: clubData, user: userData },
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
      relations: ['member', 'member.user'],
    });

    const userData = await this.User.findOne({
      where: { email: acceptUserId },
    });

    const checkJoin = await this.Member.findOne({
      where: { user: userData, club: clubData },
    });

    const checkMemmber = await this.Member.find({
      where: { user: userData },
      relations: ['club'],
    });

    const filterCheck = checkMemmber.filter((member) => {
      return member.club.type === 'MAJOR' || 'FREEDOM';
    });

    if (checkJoin) {
      throw new HttpException(
        '이미 동아리에 가입되어있는 유저입니다.',
        HttpStatus.CONFLICT,
      );
    }
    if (!userData) {
      throw new HttpException(
        '존재하지 않는 유저입니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    if (filterCheck[0] && clubtype !== 'EDITORIAL') {
      throw new HttpException(
        '다른 동아리에 가입된 유저입니다.',
        HttpStatus.CONFLICT,
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
        return member.user.email === userId && member.scope == 'HEAD';
      })
    ) {
      throw new HttpException('동아리부장이 아닙니다.', HttpStatus.FORBIDDEN);
    }
    const acceptUser = await this.RequestJoin.findOne({
      where: { club: clubData, user: userData },
    });
    await this.RequestJoin.delete(acceptUser);
    this.Member.save({ club: clubData, user: userData, scope: 'MEMBER' });
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
      where: { club: clubData, user: userData },
    });
    await this.RequestJoin.delete({ ...rejectUser });
  }

  async applicantList(clubType: string, clubtitle: string, email: string) {
    const reqUserData = await this.Club.findOne({
      relations: ['requestJoin', 'requestJoin.user', 'member', 'member.user'],
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
    const userScope = reqUserData.member.find((member) => {
      return member.user.email === email;
    }).scope;

    const requestUser = reqUserData.requestJoin.map((member) => {
      delete member.user.refreshToken;
      return member.user;
    });
    return { requestUser, userScope };
  }

  async detailPage(clubtype: string, clubtitle: string, email: string) {
    const club = await this.Club.findOne({
      where: { type: clubtype, title: clubtitle },
      relations: ['activityUrls', 'member', 'member.user'],
      select: {
        id: true,
        title: true,
        type: true,
        bannerUrl: true,
        description: true,
        contact: true,
        teacher: true,
        notionLink: true,
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
        where: { user: userData, club: club },
      });
      const isApplied = !!applicant;
      const memberForScope = club.member.find((member) => {
        return member.user.email === userData.email;
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
    if (!email) throw new UnauthorizedException('이메일이 존재하지 않습니다.');

    const clubData = await this.Club.findOne({
      where: { title: clubTitle, type: clubType },
      relations: ['member', 'member.user'],
    });

    const user = clubData.member.find((member) => {
      return member.user.email === email;
    });

    if (!user) throw new NotAcceptableException('동아리 원이 아닙니다');

    const requestUser = clubData.member.map((member) => {
      delete member.user.refreshToken;
      return { ...member.user, scope: member.scope };
    });
    return { userScope: user.scope, requestUser };
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
    const { newActivityUrls, newMember, deleteActivityUrls, deleteMember } =
      editClubData;
    const clubData = await this.Club.findOne({
      where: {
        title: editClubData.q,
        type: editClubData.type,
      },
      relations: ['member', 'member.user'],
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
    if (newMember) {
      for (const email of newMember) {
        const userData = await this.User.findOne({ where: { email } });
        const clubMemberData = await this.Member.findOne({
          where: { user: userData, club: clubData },
        });
        const checkMember = await this.Member.find({
          where: { user: userData },
          relations: ['club'],
        });
        const check = checkMember.filter((member) => {
          return member.club.type === editClubData.type;
        });
        if (!check) {
          await this.Member.save(
            this.Member.create({
              user: userData,
              club: clubData,
              scope: 'MEMBER',
            }),
          );
        }
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
      }
    }
    if (deleteMember) {
      for (const email of deleteMember) {
        const userData = await this.User.findOne({ where: { email } });
        const clubmember = await this.Member.findOne({
          where: { user: userData, club: clubData },
        });
        const checkMember = await this.Member.find({
          where: { user: userData },
          relations: ['club'],
        });
        const check = checkMember.filter((member) => {
          return member.club.type === editClubData.type;
        });
        if (!check) {
          await this.Member.delete({ user: userData, club: clubData });
        }
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
      }
    }
    if (newActivityUrls) {
      for (const image of newActivityUrls) {
        const clubImage = await this.Image.findOne({
          where: { club: clubData.id, url: image },
        });
        if (clubImage) {
          throw new HttpException(
            '동아리에 존재하는 이미지입니다.',
            HttpStatus.CONFLICT,
          );
        }
        await this.Image.save(
          this.Image.create({ url: image, club: clubData.id }),
        );
      }
      if (deleteActivityUrls) {
        for (const image of deleteActivityUrls) {
          const clubImageData = await this.Image.findOne({
            where: { club: clubData.id, url: image },
          });
          if (!clubImageData) {
            throw new HttpException(
              '동아리에 존재하지 않는 이미지입니다.',
              HttpStatus.CONFLICT,
            );
          }
          await this.Image.delete({ url: image, club: clubData.id });
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
          notionLink: editClubData.notionLink,
        },
      );
    }
  }
}
