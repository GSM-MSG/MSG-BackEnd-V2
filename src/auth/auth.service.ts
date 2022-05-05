import {
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/Entities/User.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import students from '../lib/students';
import { JwtService } from '@nestjs/jwt';
import {
  accessToken,
  refreshToken,
  oauthClientSecret,
} from 'src/lib/Constants';
import { verifyData } from './lib/verifyData';
import { LoginDto, RegisterDto, VerifyDto, verifyHeadDto } from './dto';
import { OauthMobileLoginDto } from './dto/oauthLogin.dto';
import { google } from 'googleapis';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  async oauthMobileLogin(
    data: OauthMobileLoginDto,
  ): Promise<{ refreshToken: string; accessToken: string }> {
    const oauthClient = new google.auth.OAuth2({
      clientId: data.clientId,
      clientSecret: oauthClientSecret,
    });
    const info = await oauthClient.getTokenInfo(data.idToken);
    const email = info.email;

    if (!info || !email) throw new NotFoundException('Not found oauth user');
    else if (email.split('@')[1] !== 'gsm.hs.kr')
      throw new ForbiddenException('Not gsm mail');

    const replacedEmail = email.replace('@gsm.hs.kr', '');
    const student = this.findStudent(`${email}`);
    if (!student)
      throw new ForbiddenException('GSM에 존재하지 않는 사용자입니다');
    const token = await this.getToken(replacedEmail);

    if (
      await this.userRepository.findOne({
        where: { email: replacedEmail },
      })
    ) {
      const hash = await bcrypt.hash(token.refreshToken, 10);

      this.userRepository.update(replacedEmail, {
        refreshToken: hash,
      });

      return token;
    } else {
      const register = this.jwtService.decode(data.idToken);
      const hash = await bcrypt.hash(token.refreshToken, 10);

      const user = this.userRepository.create({
        ...student,
        email: replacedEmail,
        userImg: register['picture'],
        refreshToken: hash,
      });

      this.userRepository.save(user);

      return token;
    }
  }

  async refresh(email: string, refreshToken: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Not found user or Not signed in');

    const matched = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!matched) throw new ForbiddenException('Not matched Token');

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

  async getToken(email: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        {
          email,
        },
        { expiresIn: 60 * 15, secret: accessToken },
      ),
      this.jwtService.signAsync(
        {
          email,
        },
        { expiresIn: 60 * 60 * 24 * 7, secret: refreshToken },
      ),
    ]);

    const now = new Date();
    const expiredAt = new Date(
      now.setMinutes(now.getMinutes() + 15),
    ).toISOString();

    return {
      accessToken: at,
      refreshToken: rt,
      expiredAt,
    };
  }
}
