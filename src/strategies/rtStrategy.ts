import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/Entities/User.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    const configService = new ConfigService();
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { email: string }) {
    const refreshToken = req.get('authorization').replace('Bearer ', '');

    if (!refreshToken) return null;
    if (!payload || !payload.email) return null;

    const user = await this.userRepository.findOne({
      where: { email: payload.email },
    });

    if (
      !user ||
      !user.refreshToken ||
      !(await bcrypt.compare(refreshToken, user.refreshToken))
    )
      return null;

    return { ...payload };
  }
}
