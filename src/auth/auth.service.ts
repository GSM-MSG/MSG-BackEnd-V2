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

  async register(data: RegisterDto): Promise<void> {
    const a = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (a) throw new ConflictException('존재하는 사용자입니다.');

    if (!verifyData[data.email] || verifyData[data.email].expiredAt)
      throw new ForbiddenException(`인증하지 않은 사용자입니다`);

    const student = this.findStudent(`${data.email}@gsm.hs.kr`);
    const user = this.userRepository.create({
      ...student,
      email: data.email,
      userImg: null,
    });
    // password랑 같이 유저 생성하는거 삭제해놓음

    this.userRepository.save(user);

    delete verifyData[data.email];
  }

  async verify({ email }: VerifyDto) {
    if (await this.userRepository.findOne({ where: { email: email } }))
      throw new ConflictException('이미 존재하는 사용자입니다');

    const user = this.findStudent(`${email}@gsm.hs.kr`);

    if (!user) throw new ForbiddenException('GSM에 존재하지 않는 사용자입니다');

    const num = `${Math.floor(Math.random() * 9999)}`;
    const code = num.length === 3 ? '0' + num : num;

    verifyData[email] = {
      code,
      expiredAt: new Date(new Date().setMinutes(new Date().getMinutes() + 5)),
    };
    try {
      this.emailService.userVerify(`${email}@gsm.hs.kr`, code);
    } catch (e) {
      console.log(e);
      Logger.log('이메일 전송 실패');
    }
  }

  async isVerify({ email, code }: verifyHeadDto) {
    if (!verifyData[email] || verifyData[email].code !== code)
      throw new ForbiddenException();

    if (verifyData[email].expiredAt <= new Date()) {
      delete verifyData[email];
      throw new ForbiddenException();
    }

    verifyData[email].expiredAt = null;
  }

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
      throw new ForbiddenException();

    const token = await this.getToken(email);

    if (
      await this.userRepository.findOne({
        where: { email: email },
      })
    ) {
      const hash = await bcrypt.hash(token.refreshToken, 10);

      this.userRepository.update(email, {
        refreshToken: hash,
      });

      return token;
    } else {
      const register = this.jwtService.decode(data.idToken, { json: true });
      const student = this.findStudent(`${email}`);
      if (!student)
        throw new ForbiddenException('GSM에 존재하지 않는 사용자입니다');

      const user = this.userRepository.create({
        ...student,
        email: email,
        userImg: register['picture'],
      });

      this.userRepository.save(user);

      return token;
    }
  }

  async login(
    data: LoginDto,
  ): Promise<{ refreshToken: string; accessToken: string }> {
    const user = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (!user) throw new ForbiddenException('사용자를 찾을 수 없습니다');

    // Password로 유저 검사하는 부분 삭제해놓음

    const token = await this.getToken(data.email);

    const hash = await bcrypt.hash(token.refreshToken, 10);

    this.userRepository.update(data.email, {
      refreshToken: hash,
    });

    return token;
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
