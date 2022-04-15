import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from 'src/Entities/Member.entity';
import { User } from 'src/Entities/User.entity';
import { createQueryBuilder, Repository } from 'typeorm';
import { urlDto } from './dto/urlAddress.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private User: Repository<User>) {}

  async getUserData(email: string) {
    const userData = await this.User.findOne(
      { email: email },
      { relations: ['member', 'member.club'] },
    );
    delete userData.refreshToken;
    delete userData.password;
    const clubs = userData.member.map((member) => {
      return member.club;
    });

    delete userData.member;
    return { userData, clubs };
  }
  async editProfile(urlAddress: urlDto, email: string) {
    await this.User.update({ email: email }, { userImg: urlAddress.url });
  }
  async searchUser(name: string, clubType: string) {
    if (clubType === 'MAJOR' || clubType == 'FREEDOM') {
      const data = await this.User.query(
        "CALL msg.findUserNotJoin('" + clubType + "' , '" + name + "');",
      );
      return data[0].map((user) => {
        delete user.password;
        delete user.refreshToken;
        return user;
      });
    } else if (clubType === 'EDITORIAL') {
      return await this.User.find();
    } else
      throw new HttpException('없는 동아리 타입입니다', HttpStatus.BAD_GATEWAY);
  }
}
