import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/Entities/User.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import students from '../lib/students';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { accessToken, refreshToken } from 'src/lib/Constants';

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

    const hash = await bcrypt.hash(data.password, 10);
    const isVerified = await bcrypt.hash(data.email, 10);

    this.emailService.userVerify(
      `${data.email}@gsm.hs.kr`,
      isVerified,
      data.email,
    );

    const User = this.userRepository.create({
      ...student,
      email: data.email,
      password: hash,
      userImg: null,
      isVerified,
    });

    this.userRepository.save(User);
  }

  async verify(email: string, token: string) {
    if (!email || !token)
      throw new BadRequestException('Not have email or token');

    const user = await this.userRepository.findOne({ where: { email: email } });

    if (!user) throw new UnauthorizedException('Not Found User');

    if (!(token === user.isVerified))
      throw new ForbiddenException('Warning user');

    await this.userRepository.update(email, { isVerified: null });
  }

  async isVerify(email: string) {
    if (!email) throw new BadRequestException('Not have email');

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Not Found User');

    if (user.isVerified) throw new UnauthorizedException();
  }

  async login(
    data: LoginDto,
  ): Promise<{ refresh_token: string; access_token: string }> {
    const user = await this.userRepository.findOne({
      where: { email: data.email },
    });

    if (!user) throw new UnauthorizedException('Not Found User');

    if (!(await bcrypt.compare(data.password, user.password)))
      throw new UnauthorizedException('Not matched password');

    const token = await this.getToken(data.email);

    this.userRepository.update(data.email, {
      refreshToken: token.refresh_token,
    });

    return token;
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

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
