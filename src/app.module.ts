import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubController } from './club/club.controller';
import { ClubModule } from './club/club.module';
import entities from './Entities';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_NAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE,
      entities: [...entities],
      synchronize: true,
    }),
    ClubModule,
  ],
  controllers: [ClubController],
  providers: [],
})
export class AppModule {}
