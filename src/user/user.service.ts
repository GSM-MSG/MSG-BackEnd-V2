import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClubDataDto } from '../Club/dto/ClubData.dto';
import { Club } from 'src/Entities/Club.entity';
import { Member } from 'src/Entities/Member.entity';
import { User } from 'src/Entities/User.entity';
import { Repository } from 'typeorm';
import { UrlDto } from './dto/urlAddress.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private User: Repository<User>,
    @InjectRepository(Club) private Club: Repository<Club>,
    @InjectRepository(Member) private Member: Repository<Member>,
  ) {}

  async getUserData(email: string) {
    const userData = await this.User.findOne({
      where: { email },
      relations: [
        'member',
        'member.club',
        'classRegistration',
        'classRegistration.afterSchool',
      ],
    });
    delete userData.refreshToken;
    const clubs = userData.member.map((member) => {
      return member.club;
    });
    const afterSchools = userData.classRegistration.map((member) => {
      return member.afterSchool;
    });
    delete userData.member;
    return { userData, clubs, afterSchools };
  }
  async editProfile(urlAddress: UrlDto, email: string) {
    await this.User.update({ email: email }, { userImg: urlAddress.url });
  }
  async searchUser(name: string, clubType: string, email: string) {
    if (clubType === 'MAJOR' || clubType === 'FREEDOM') {
      const data = await this.User.query(
        "CALL msg.findUserNotJoin('" + clubType + "' , '" + name + "');",
      );

      const newArr = data[0].filter((element) => element.email != email);
      return newArr.map((user) => {
        delete user.refreshToken;
        return user;
      });
    } else if (clubType === 'EDITORIAL') {
      const data = await this.User.query(
        "CALL msg.findUserByName('" + name + "');",
      );

      const newArr = data[0].filter((element) => element.email != email);
      return newArr.map((user) => {
        delete user.refreshToken;
        return user;
      });
    } else
      throw new HttpException('없는 동아리 타입입니다', HttpStatus.BAD_GATEWAY);
  }
  async exitClub(exitclubData: ClubDataDto, email: string) {
    const clubData = await this.Club.findOne({
      where: { title: exitclubData.q, type: exitclubData.type },
      relations: ['member', 'member.user'],
    });
    const member = clubData.member.find((member) => {
      return member.user.email === email;
    });
    if (!clubData)
      throw new HttpException('없는 동아리 입니다', HttpStatus.BAD_REQUEST);
    else if (!member)
      throw new HttpException(
        '동아리 멤버가 아닙니다',
        HttpStatus.NOT_ACCEPTABLE,
      );
    else if (member.scope === 'HEAD')
      throw new HttpException(
        '동아리 부장은 탈퇴가 불가능합니다',
        HttpStatus.FORBIDDEN,
      );
    await this.Member.delete({ club: clubData, user: member.user });
  }
  async withdrawal(email: string) {
    const findUserData = await this.User.findOne({
      where: { email },
      relations: ['member', 'member.club'],
    });

    if (!findUserData) {
      throw new HttpException(
        '존재하지 않는 유저입니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    if (findUserData.member.length) {
      findUserData.member
        .filter((member) => {
          return member.scope === 'HEAD';
        })
        .forEach(async (head) => {
          await this.Club.delete(head.club);
        });
    }
    await this.User.delete(findUserData.email);
  }
}
