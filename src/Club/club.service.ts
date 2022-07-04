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
    let checkClubMember: Member;
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
    if (await this.Club.findOne({ where: { title: title, type: type } })) {
      throw new HttpException(
        '이미 존재하는 동아리입니다',
        HttpStatus.CONFLICT,
      );
    }
    let deduplication = new Set(member); //중복을 제거하는 배열 생성
    let deduplicatedMember = Array.from(deduplication); //set타입을 배열 형식으로 변경
    const userData = await this.User.findOne({
      where: { email },
      relations: ['member', 'member.user', 'member.club'],
    });

    if (!userData) {
      throw new HttpException(
        '존재하지 않는 유저입니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (userData.member && type !== 'EDITORIAL') {
      checkClubMember = userData.member.find((member) => {
        return member.club.type === type;
      });
    }
    if (checkClubMember) {
      throw new HttpException(
        '다른 동아리에 소속되어있습니다..',
        HttpStatus.BAD_REQUEST,
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
    if (member.length) {
      const members = deduplicatedMember.map(async (user) => {
        const userData = await this.checkUser(user, clubData);
        return this.Member.create({
          user: userData,
          club: clubData,
          scope: 'MEMBER',
        });
      });
      await this.Member.save(await Promise.all(members));
    }
    if (activityUrls.length) {
      const activityUrl = activityUrls.map(async (img) => {
        return this.Image.create({ url: img, club: clubData });
      });
      await this.Image.save(await Promise.all(activityUrl));
    }
  }

  async checkUser(email: string, clubData: Club) {
    let checkReqJoin: RequestJoin;
    let findOthers: Member;
    const userData = await this.User.findOne({
      where: { email },
      relations: ['member', 'member.club', 'requestJoin', 'requestJoin.club'],
    });
    if (!userData) {
      await this.Club.delete(clubData);
      throw new HttpException(
        `${email}는존재하지 않는 유저입니다.`,
        HttpStatus.NOT_FOUND,
      );
    }
    const checkJoin = userData.member.find((member) => {
      return member.club.id === clubData.id;
    });
    if (checkJoin) {
      await this.Club.delete(clubData);
      throw new HttpException(
        `${email}는 이미 가입되어 있는 유저입니다.`,
        HttpStatus.CONFLICT,
      );
    }
    if (userData.requestJoin.length && clubData.type !== 'EDITORIAL') {
      checkReqJoin = userData.requestJoin.find((user) => {
        return user.club.type === clubData.type;
      });
    }
    if (checkReqJoin) {
      await this.Club.delete(clubData);
      throw new HttpException(
        `${email}다른 동아리에 신청을 넣은 유저입니다.`,
        HttpStatus.BAD_REQUEST,
      );
    }
    if (userData.member.length && clubData.type !== 'EDITORIAL') {
      findOthers = userData.member.find((member) => {
        return member.club.type === clubData.type;
      });
    }
    if (findOthers) {
      await this.Club.delete(clubData);
      throw new HttpException(
        `${email}다른 동아리에 소속되어 있습니다.`,
        HttpStatus.BAD_REQUEST,
      );
    }
    delete userData.member;
    delete userData.requestJoin;
    return userData;
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
    let findOthers: Member[] = [];
    const clubData = await this.Club.findOne({
      where: { type, title },
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
    const checkApply = userData.requestJoin.filter((requestJoin) => {
      return requestJoin.club.id === clubData.id;
    });

    if (checkApply.length) {
      throw new HttpException(
        '이미 이 동아리에 가입신청을 하였습니다.',
        HttpStatus.CONFLICT,
      );
    }
    if (userData.member.length && type !== 'EDITORIAL') {
      findOthers = userData.member.filter((member) => {
        return member.club.type === type;
      });
    }

    if (findOthers.length && type !== 'EDITORIAL') {
      throw new HttpException(
        '다른 동아리에 소속되어있습니다.',
        HttpStatus.CONFLICT,
      );
    }
    const checkOtherclub = userData.requestJoin.filter((member) => {
      return member.club.type !== 'EDITORIAL' && member.club.id !== clubData.id;
    });
    if (checkOtherclub.length && type !== 'EDITORIAL') {
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

  async acceptClub(type: string, title: string, email: string, headId: string) {
    let findOthers: Member;
    const clubData = await this.Club.findOne({
      where: { type, title },
      relations: ['member', 'member.user'],
    });

    if (!clubData) {
      throw new HttpException(
        '존재하지 않는 동아리입니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    const userData = await this.User.findOne({
      where: { email },
      relations: ['member', 'member.club'],
    });

    if (!userData) {
      throw new HttpException(
        '존재하지 않는 유저입니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    const checkJoin = userData.member.filter((member) => {
      return member.club.id === clubData.id;
    });
    if (userData.member.length && type !== 'EDITORIAL') {
      findOthers = userData.member.find((member) => {
        return (
          member.club.type === type && member.club.title !== clubData.title
        );
      });
    }
    if (checkJoin.length) {
      throw new HttpException(
        '이미 동아리에 가입되어있는 유저입니다.',
        HttpStatus.CONFLICT,
      );
    }
    if (findOthers && type !== 'EDITORIAL') {
      throw new HttpException(
        '다른 동아리에 가입된 유저입니다.',
        HttpStatus.CONFLICT,
      );
    }
    if (
      !clubData.member.filter((member) => {
        return member.user.email === headId && member.scope === 'HEAD';
      })
    ) {
      throw new HttpException('동아리부장이 아닙니다.', HttpStatus.FORBIDDEN);
    }
    const acceptUser = await this.RequestJoin.findOne({
      where: { club: clubData, user: userData },
    });
    if (!acceptUser) {
      throw new HttpException(
        '신청을 수락할 유저가 없습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
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
      relations: ['member', 'member.user'],
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
    let activityUrls: string[];
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
    if (!club) {
      throw new HttpException(
        '존재하지않는 동아리입니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (club.member.length === 0) {
      delete club.member;
      delete club.activityUrls;
      await this.Club.delete(club);
      throw new HttpException(
        '동아리에 멤버가 아무도 존재하지 않습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const userData = await this.User.findOne({
      where: { email },
      relations: ['member', 'member.club', 'requestJoin', 'requestJoin.club'],
    });

    const head = club.member.find((member) => {
      return member.scope === 'HEAD';
    });

    const clubMembers = club.member.filter((member) => {
      return member.scope === 'MEMBER';
    });

    if (club.activityUrls) {
      activityUrls = club.activityUrls.map((url) => {
        return url.url;
      });
    }
    const applicant = await this.RequestJoin.findOne({
      where: { user: userData, club: club },
    });
    const isApplied = !!applicant;
    const memberForScope = club.member.find((member) => {
      return member.user.email === userData.email;
    });
    let scope = memberForScope ? memberForScope.scope : 'USER';
    let result: Member | RequestJoin;

    if (
      scope === 'USER' &&
      userData.member.filter((m) => {
        return m.club.type === clubtype;
      }).length
    ) {
      result = userData.member.find((member) => {
        return member.club.type === clubtype.toUpperCase();
      });
    }
    if (result) {
      scope = 'OTHER';
    }

    delete club.member;
    delete club.activityUrls;

    return {
      club,
      activityUrls,
      head: head.user,
      member: clubMembers.map((user) => {
        return user.user;
      }),
      scope,
      isApplied,
    };
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
    if (userData.userId === email) {
      throw new HttpException(
        '부장은 자기 자신에게 위임할 수 없습니다',
        HttpStatus.FORBIDDEN,
      );
    }
    const clubData = await this.Club.findOne({
      where: {
        title: userData.q,
        type: userData.type,
      },
      relations: ['member', 'member.user'],
    });
    if (
      !clubData.member.find((member) => {
        return member.user.email === email && member.scope === 'HEAD';
      })
    ) {
      throw new HttpException('동아리 부장이 아닙니다', HttpStatus.FORBIDDEN);
    }
    let memberData = clubData.member.find((member) => {
      return member.user.email === userData.userId;
    });
    const headData = clubData.member.find((member) => {
      return member.user.email === email;
    });

    await this.Member.update(
      { club: clubData, user: memberData.user },
      { scope: 'HEAD' },
    );
    await this.Member.update(
      { club: clubData, user: headData.user },
      { scope: 'MEMBER' },
    );
  }

  async editClub(editClubData: EditClubDto, email: string) {
    const { newActivityUrls, deleteActivityUrls } = editClubData;
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
    if (newActivityUrls) {
      for (const image of newActivityUrls) {
        const clubImage = await this.Image.findOne({
          where: { club: clubData, url: image },
        });
        if (clubImage) {
          throw new HttpException(
            '동아리에 존재하는 이미지입니다.',
            HttpStatus.CONFLICT,
          );
        }
        await this.Image.save(
          this.Image.create({ url: image, club: clubData }),
        );
      }
      if (deleteActivityUrls) {
        for (const image of deleteActivityUrls) {
          const clubImageData = await this.Image.findOne({
            where: { club: clubData, url: image },
          });
          if (!clubImageData) {
            throw new HttpException(
              '동아리에 존재하지 않는 이미지입니다.',
              HttpStatus.CONFLICT,
            );
          }
          await this.Image.delete({ url: image, club: clubData });
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
