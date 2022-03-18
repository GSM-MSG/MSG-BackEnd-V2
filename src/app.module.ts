import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubService } from './club/club.service';
import { ClubController } from './-club/-club.controller';
import { ClubController } from './club/club.controller';
import { ClubModule } from './club/club.module';
import entities from './Entities';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'msg',
      entities: [...entities],
      synchronize: true,
    }),
    ClubModule,
  ],
  controllers: [ClubController],
  providers: [ClubService],
})
export class AppModule {}
