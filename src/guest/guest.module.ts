import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import Entities from 'src/Entities';
import { GuestController } from './guest.controller';
import { GuestService } from './guest.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([...Entities]), JwtModule, HttpModule],
  controllers: [GuestController],
  providers: [GuestService],
})
export class GuestModule {}
