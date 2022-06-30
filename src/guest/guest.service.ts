import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwksClient from 'jwks-rsa';
import { Club } from 'src/Entities/Club.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { appleRevokeDto, appleSigninDto } from './dto';
import * as fs from 'fs';

export interface ApplePublicKeyType {
  keys: Array<{
    [key: string]: string;
  }>;
}

@Injectable()
export class GuestService {
  constructor(
    @InjectRepository(Club) private Club: Repository<Club>,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async appleSignin(data: appleSigninDto) {
    const decoded = this.jwtService.decode(data.idToken, {
      complete: true,
      json: true,
    });
    const kid: string = decoded['header']['kid'];
    const alg: string = decoded['header']['alg'];
    const publicKey = await this.getPublicKey(kid, alg);

    const result = jwt.verify(data.idToken, publicKey);
    this.validateToken(result);

    const secret = this.generateSecretKey();

    const params = new URLSearchParams({
      client_id: this.configService.get('APPLE_CLIENT_ID'),
      client_secret: secret,
      grant_type: 'authorization_code',
      code: data.code,
    });
    try {
      const res = (
        await this.httpService
          .post('https://appleid.apple.com/auth/token', params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          })
          .toPromise()
      ).data;
      return res;
    } catch {
      throw new UnauthorizedException(
        '유효하지 않은 앱에서 인증을 요청하였습니다.',
      );
    }
  }

  async appleRevoke(data: appleRevokeDto) {
    const secret = this.generateSecretKey();

    const params = new URLSearchParams({
      client_id: this.configService.get('APPLE_CLIENT_ID'),
      client_secret: secret,
      token_type_hint: 'refresh_token',
      token: data.refreshToken,
    });

    try {
      const res = (
        await this.httpService
          .post('https://appleid.apple.com/auth/revoke', params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          })
          .toPromise()
      ).data;
      return res;
    } catch {
      throw new UnauthorizedException(
        '유효하지 않은 앱에서 인증을 요청하였습니다.',
      );
    }
  }

  private generateSecretKey() {
    const timeNow = Math.floor(Date.now() / 1000);

    const claims = {
      iss: this.configService.get('APPLE_TEAM_ID'),
      iat: timeNow,
      exp: timeNow + 60 * 60 * 24 * 7,
      aud: 'https://appleid.apple.com',
      sub: this.configService.get('APPLE_CLIENT_ID'),
    };

    return jwt.sign(claims, fs.readFileSync('src/lib/AuthKey.p8', 'utf8'), {
      header: { alg: 'ES256', kid: this.configService.get('APPLE_KEY_ID') },
    });
  }

  private validateToken(token) {
    if (token.iss !== 'https://appleid.apple.com') {
      throw new UnauthorizedException();
    }
  }
  private async getPublicKey(keyid: string, algorithm: string) {
    const applePublicKeys: ApplePublicKeyType = (
      await this.httpService
        .get('https://appleid.apple.com/auth/keys')
        .toPromise()
    ).data;

    const client: jwksClient.JwksClient = jwksClient({
      jwksUri: 'https://appleid.apple.com/auth/keys',
    });

    const validKid: string = applePublicKeys.keys.filter(
      (element) => element['kid'] === keyid && element['alg'] === algorithm,
    )[0]?.['kid'];

    if (!validKid) {
      throw new UnauthorizedException(
        '유효하지 않은 앱에서 인증을 요청하였습니다.',
      );
    }
    const key: jwksClient.CertSigningKey | jwksClient.RsaSigningKey =
      await client.getSigningKey(validKid);
    return key.getPublicKey();
  }

  async guestDetailPage(clubType: string, clubName: string) {
    const club = await this.Club.findOne({
      where: { type: clubType, title: clubName },
      relations: ['activityUrls', 'member', 'member.user'],
      select: {
        id: true,
        title: true,
        type: true,
        bannerUrl: true,
        description: true,
        contact: true,
        teacher: true,
        notionLink: true,
        isOpened: true,
        member: {
          id: true,
          user: {
            email: true,
            name: true,
            grade: true,
            class: true,
            num: true,
            userImg: true,
          },
          scope: true,
        },
        activityUrls: { id: true, url: true },
      },
    });

    if (!club)
      throw new HttpException(
        '존재하지 않는 동아리입니다.',
        HttpStatus.NOT_FOUND,
      );
    const head = club.member.find((member) => {
      return member.scope === 'HEAD';
    });

    const clubMembers = club.member.filter((member) => {
      return member.scope === 'MEMBER';
    });

    if (club.activityUrls) {
      const activityUrls = club.activityUrls.map((url) => {
        return url.url;
      });
      const isApplied = false;
      const scope = 'USER';

      delete club.member;
      delete club.activityUrls;

      return {
        club,
        activityUrls,
        head: head.user,
        member: clubMembers.map((user) => {
          return user.user;
        }),
        scope,
        isApplied,
      };
    }
  }

  async list(clubType: string) {
    if (!clubType) {
      throw new HttpException('동아리타입이 없습니다.', HttpStatus.BAD_REQUEST);
    }
    if (clubType === 'MAJOR' || 'EDITORIAL' || 'FREEDOM') {
      const clubData = await this.Club.find({
        where: { type: clubType },
        select: ['type', 'title', 'bannerUrl'],
      });
      return clubData;
    } else {
      throw new HttpException(
        '동아리타입이 잘못되었습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
