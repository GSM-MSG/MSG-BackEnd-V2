import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import entities from '../Entities';
import { UserWebController } from './user.web.controller';

@Module({
  imports: [TypeOrmModule.forFeature([...entities])],
  controllers: [UserController, UserWebController],
  providers: [UserService],
})
export class UserModule {}
