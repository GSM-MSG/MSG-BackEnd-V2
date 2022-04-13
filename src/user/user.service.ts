import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/Entities/User.entity';
import { Repository } from 'typeorm';
import { urlDto } from './dto/urlAddress.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private user: Repository<User>) {}

  async getUserData(email: string) {
    const userData = await this.user.findOne(
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
    await this.user.update({ email: email }, { userImg: urlAddress.url });
  }
}
