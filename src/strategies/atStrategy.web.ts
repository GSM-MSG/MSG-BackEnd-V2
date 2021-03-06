import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/Entities/User.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

type JwtPayload = {
  email: string;
};

@Injectable()
export class AtStrategyWeb extends PassportStrategy(Strategy, 'jwt-web') {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    const configService = new ConfigService();
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const cookie = req.cookies['accessToken'];
          if (!cookie) return null;
          return cookie;
        },
      ]),
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload || !payload.email) return null;

    const user = await this.userRepository.findOne({
      where: { email: payload.email },
    });
    if (!user) return null;
    return payload;
  }
}
