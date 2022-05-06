import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/Entities/User.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import students from '../lib/students';
import { JwtService } from '@nestjs/jwt';
import { OauthMobileLoginDto } from './dto/oauthLogin.dto';
import { Auth, google } from 'googleapis';
import { ConfigService } from '@nestjs/config';

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

  async oauthMobileLogin(
    data: OauthMobileLoginDto,
  ): Promise<{ refreshToken: string; accessToken: string }> {
    let payload: Auth.TokenPayload
    
    try {
      const ticket = await this.oauthClient.verifyIdToken({ idToken: data.idToken, audience: this.configService.get('GOOGLE_AUTH_CLIENT_ID') });
      payload = ticket.getPayload();
    } catch {
      throw new BadRequestException('Invalid Token');
    }
    
    const email = payload.email;

    if (!payload || !email) throw new NotFoundException('Not found oauth user');
    else if (email.split('@')[1] !== 'gsm.hs.kr')
      throw new ForbiddenException('Not gsm mail');

    const replacedEmail = email.replace('@gsm.hs.kr', '');
    const student = this.findStudent(`${email}`);

    if (!student) throw new ForbiddenException('Not exists student in GSM');

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
      const hash = await bcrypt.hash(token.refreshToken, 10);

      const user = this.userRepository.create({
        ...student,
        email: replacedEmail,
        userImg: payload.picture,
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
