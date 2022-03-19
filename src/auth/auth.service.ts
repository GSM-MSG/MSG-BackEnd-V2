import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/Entities/User.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import students from '../lib/students';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private emailService: EmailService,
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

  async verifyHead(email: string, token: string) {
    if (!email || !token)
      throw new BadRequestException('Not have email or token');

    const user = await this.userRepository.findOne({ where: { email: email } });

    if (!user) throw new BadRequestException('Not Found User');

    if (!(token === user.isVerified))
      throw new ForbiddenException('Warning user');

    await this.userRepository.update(email, { isVerified: null });
  }

  findStudent(email: string) {
    return students.find((i) => i.email === email);
  }
}
