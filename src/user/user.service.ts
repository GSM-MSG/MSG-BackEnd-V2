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
      relations: ['member', 'member.club'],
    });
    delete userData.refreshToken;
    const clubs = userData.member.map((member) => {
      return member.club;
    });

    delete userData.member;
    return { userData, clubs };
  }
  async editProfile(urlAddress: UrlDto, email: string) {
    await this.User.update({ email: email }, { userImg: urlAddress.url });
  }
  async searchUser(name: string, clubType: string, email: string) {
    if (clubType === 'MAJOR' || clubType === 'FREEDOM') {
      const data = await this.User.query(
        "CALL msg.findUserNotJoin('" + clubType + "' , '" + name + "');",
      );
      if (
        data[0].find((user) => {
          return user.email === email;
        })
      ) {
        delete data[0][
          data[0].findIndex((user) => {
            return user.email === email;
          })
        ];
      }
      let newArr = data[0].filter((element) => element != null);
      return newArr.map((user: any) => {
        delete user.refreshToken;
        return user;
      });
    } else if (clubType === 'EDITORIAL') {
      const data = await this.User.query(
        "CALL msg.findUserByName('" + name + "');",
      );
      if (
        data[0].find((user) => {
          return user.email === email;
        })
      ) {
        delete data[0][
          data[0].findIndex((user) => {
            return user.email === email;
          })
        ];
      }
      let newArr = new Array();
      newArr = data[0].filter((element) => element != null);
      return newArr.map((user: any) => {
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
      throw new HttpException('없는 동아리 입니다', HttpStatus.NOT_FOUND);
    else if (!member)
      throw new HttpException('동아리 멤버가 아닙니다', HttpStatus.BAD_GATEWAY);
    else if (member.scope === 'HEAD')
      throw new HttpException(
        '동아리 부장은 탈퇴가 불가능합니다',
        HttpStatus.FORBIDDEN,
      );
    await this.Member.delete({ club: clubData, user: member.user });
  }
}
