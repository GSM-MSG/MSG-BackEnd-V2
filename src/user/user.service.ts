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
      { relations: ['requestJoin', 'requestJoin.clubId'] },
    );
    delete userData.refreshToken;
    delete userData.password;
    return userData;
  }
  async editProfile(urlAddress: urlDto, email: string) {
    await this.user.update({ email: email }, { userImg: urlAddress.url });
  }
}
