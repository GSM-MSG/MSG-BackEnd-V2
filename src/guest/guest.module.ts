import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Entities from 'src/Entities';
import { GuestController } from './guest.controller';
import { GuestService } from './guest.service';

@Module({
  imports: [TypeOrmModule.forFeature([...Entities])],
  controllers: [GuestController],
  providers: [GuestService],
})
export class GuestModule {}
