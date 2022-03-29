import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubModule } from './club/club.module';
import entities from './Entities';
import { AuthModule } from './auth/auth.module';
import { CheckModule } from './check/check.module';
import { AtStrategy } from './strategies/atStrategy';
import { RtStrategy } from './strategies/rtStrategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
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
    AuthModule,
    CheckModule,
  ],
  providers: [AtStrategy, RtStrategy],
})
export class AppModule {}
