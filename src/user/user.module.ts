import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import entities from '../Entities';

@Module({
  imports: [TypeOrmModule.forFeature([...entities])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
