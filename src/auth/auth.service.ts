import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/Entities/User.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  async register(data: RegisterDto): Promise<void> {
    const hash = await bcrypt.hash(data.password, 10);
    const isVerified = await bcrypt.hash(data.email, 10);

    if (await this.userRepository.findOne({ where: { email: data.email } }))
      throw new ForbiddenException();

    const User = this.userRepository.create({
      email: data.email,
      password: hash,
      class: 1,
      grade: 2,
      name: '변찬우',
      num: 9,
      userImg: null,
      isVerified,
    });

    this.emailService.userVerify(`${data.email}@gsm.hs.kr`, isVerified);

    this.userRepository.save(User);
  }
}
