import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmailService } from 'src/email/email.service';
import { User } from 'src/Entities/User.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy } from './strategies/atStrategy';
import { RtStrategy } from './strategies/rtStrategy';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({})],
  providers: [AuthService, EmailService, AtStrategy, RtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
