import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/Entities/User.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import students from '../lib/students';
import { StudentType } from '../types/StudentType';
import { JwtService } from '@nestjs/jwt';
import { OauthMobileLoginDto } from './dto/oauthLogin.dto';
import { Auth, google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { GoogleType } from './types/googleType';

@Injectable()
export class AuthService {
  private oauthClient: Auth.OAuth2Client;
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    const clientID = configService.get('GOOGLE_AUTH_CLIENT_ID');
    const clientSecret = configService.get('GOOGLE_AUTH_CLIENT_SECRET');

    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

  async oauthMobileLogin(data: OauthMobileLoginDto) {
    let payload: Auth.TokenPayload;

    try {
      const ticket = await this.oauthClient.verifyIdToken({
        idToken: data.idToken,
        audience: [
          this.configService.get('GOOGLE_AUTH_IOS_ID'),
          this.configService.get('GOOGLE_AUTH_AOS_ID1'),
          this.configService.get('GOOGLE_AUTH_AOS_ID2'),
          this.configService.get('GOOGLE_AUTH_AOS_ID3'),
          this.configService.get('GOOGLE_AUTH_AOS_ID4'),
          this.configService.get('GOOGLE_AUTH_CLIENT_ID'),
        ],
      });
      payload = ticket.getPayload();
    } catch (e) {
      Logger.error(e);
      throw new BadRequestException('Invalid Token');
    }

    const email = payload.email;
    let student = this.findStudent(email);

    if (email === 'forgcms@gmail.com') {
      student = {
        grade: 10,
        class: 10,
        num: 10,
        name: '심사용',
        email: 'forgcms@gmail.com'
      };
    }
    else if (!payload || !email) throw new NotFoundException('Not found oauth user');
    else if (payload.hd !== 'gsm.hs.kr')
      throw new ForbiddenException('Not GSM mail');
    else if (!student) throw new NotFoundException('Not exists student in GSM');

    const token = await this.getToken(email);
    const refreshToken = await bcrypt.hash(token.refreshToken, 10);

    if (
      await this.userRepository.findOne({
        where: { email },
      })
    ) {
      this.userRepository.update(email, {
        refreshToken,
      });
    } else {
      const user = this.userRepository.create({
        ...student,
        email,
        userImg: payload.picture,
        refreshToken,
      });

      this.userRepository.save(user);
    }
    return token;
  }

  async webGoogleOauth(user: GoogleType) {
    const User = new Object(user);
    const student = this.findStudent(user._json.email);

    if (!User.hasOwnProperty('id') || user._json.hd !== 'gsm.hs.kr' || !student)
      return null;

    const email = user._json.email;

    return this.saveUser(email, user._json.picture, student);
  }

  async refresh(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Not found user or Not signed in');

    const tokens = await this.getToken(email);
    const hash: string = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userRepository.update(email, { refreshToken: hash });

    return tokens;
  }

  async refreshWeb(email: string) {
    const tokens = await this.getToken(email);
    const hash: string = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userRepository.update(email, { refreshToken: hash });

    return tokens;
  }

  async logout(email: string) {
    if (!(await this.userRepository.findOne({ where: { email } })))
      throw new ForbiddenException('Not Found User');

    await this.userRepository.update(email, { refreshToken: null });
  }

  findStudent(email: string) {
    return students.find((i) => i.email === email);
  }

  async saveUser(email: string, userImg: string, student: StudentType) {
    const token = await this.getToken(email);
    const hash = await bcrypt.hash(token.refreshToken, 10);

    if (
      await this.userRepository.findOne({
        where: { email },
      })
    ) {
      this.userRepository.update(email, {
        refreshToken: hash,
      });
    } else {
      const user = this.userRepository.create({
        ...student,
        email,
        userImg,
        refreshToken: hash,
      });

      this.userRepository.save(user);
    }
    return token;
  }

  async getToken(email: string) {
    const now = new Date();

    const [at, rt, AtExpired, RtExpired] = await Promise.all([
      this.jwtService.signAsync(
        {
          email,
        },
        {
          expiresIn: 60 * 15,
          secret: this.configService.get('ACCESS_TOKEN_SECRET'),
        },
      ),
      this.jwtService.signAsync(
        {
          email,
        },
        {
          expiresIn: 60 * 60 * 24 * 7,
          secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        },
      ),
      new Date(now.setMinutes(now.getMinutes() + 15)),
      new Date(now.setDate(now.getDate() + 7)),
    ]);

    const expiredAt = new Date(
      now.setMinutes(now.getMinutes() + 15),
    ).toISOString();

    return {
      accessToken: at,
      refreshToken: rt,
      AtExpired,
      RtExpired,
      expiredAt,
    };
  }
}
