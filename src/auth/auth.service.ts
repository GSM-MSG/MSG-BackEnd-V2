import {
  ConflictException,
  ForbiddenException,
  Injectable,
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
    const a = await this.userRepository.findOne({
      where: { email: data.email },
    });
    if (a) throw new ConflictException('already exist user');

    if (!verifyData[data.email] || verifyData[data.email].expiredAt)
      throw new ForbiddenException(
        `Not Authentication User ${data.email}@gsm.hs.kr`,
      );

    const student = this.findStudent(`${data.email}@gsm.hs.kr`);

    const hash = await bcrypt.hash(data.password, 10);

    const user = this.userRepository.create({
      ...student,
      email: data.email,
      password: hash,
      userImg: null,
    });

    this.userRepository.save(user);

    delete verifyData[data.email];
    console.log(verifyData);
  }

  async verify({ email }: VerifyDto) {
    if (await this.userRepository.findOne({ where: { email: email } }))
      throw new ConflictException('already exist user');

    const user = this.findStudent(`${email}@gsm.hs.kr`);

    console.log(user);

    if (!user) throw new ForbiddenException('Not Found User');

    const num = `${Math.floor(Math.random() * 9999)}`;
    const code = num.length === 3 ? '0' + num : num;

    verifyData[email] = {
      code,
      expiredAt: new Date(new Date().setMinutes(new Date().getMinutes() + 5)),
    };

    this.emailService.userVerify(`${email}@gsm.hs.kr`, code);
    console.log(verifyData);
  }

  async isVerify({ email, code }: verifyHeadDto) {
    if (verifyData[email].code !== code)
      throw new ForbiddenException('Failed Authentication');

    if (verifyData[email].expiredAt <= new Date()) {
      delete verifyData[email];
      throw new ForbiddenException('Time excess');
    }

    verifyData[email].expiredAt = null;
    console.log(verifyData);
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
