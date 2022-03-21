import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/Entities/User.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import students from '../lib/students';
import { JwtService } from '@nestjs/jwt';
import { accessToken, refreshToken } from 'src/lib/Constants';
import { verifyData } from './lib/verifyData';
import { LoginDto, RegisterDto, VerifyDto, verifyHeadDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto): Promise<void> {
    if (await this.userRepository.findOne({ where: { email: data.email } }))
      throw new ForbiddenException('already exist user');

    const student = this.findStudent(`${data.email}@gsm.hs.kr`);
    if (!student) {
      Logger.error(`Not Found ${data.email}`);
      throw new BadRequestException(`Not Found User ${data.email}@gsm.hs.kr`);
    }
  }

  async verify({ email }: VerifyDto) {
    const user = this.findStudent(email);

    if (!user) throw new ForbiddenException('Not Found User');

    const num = `${Math.floor(Math.random() * 9999)}`;
    const code = num.length === 3 ? '0' + num : num;

    verifyData[email] = {
      code,
      expiredAt: new Date(new Date().setMinutes(new Date().getMinutes() + 5)),
    };

    this.emailService.userVerify(`${email}@gsm.hs.kr`, code);
  }

  async isVerify({ email, code }: verifyHeadDto) {
    if (verifyData[email].code !== code)
      throw new ForbiddenException('인증 실패');

    if (verifyData[email].expiredAt <= new Date())
      throw new ForbiddenException('시간 초과');

    verifyData[email].expiredAt = null;
  }

  async login(
    data: LoginDto,
  ): Promise<{ refresh_token: string; access_token: string }> {
    const user = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (!user) throw new ForbiddenException('Not Found User');

    if (!(await bcrypt.compare(data.password, user.password)))
      throw new ForbiddenException('Not matched password');

    const token = await this.getToken(data.email);

    const hash = await bcrypt.hash(token.refresh_token, 10);

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
    const hash: string = await bcrypt.hash(tokens.refresh_token, 10);
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
      now.setMinutes(now.getMinutes() - 15),
    ).toISOString();

    return {
      access_token: at,
      refresh_token: rt,
      expiredAt,
    };
  }
}
