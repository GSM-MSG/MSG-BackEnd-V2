import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClubModule } from './Club/club.module';
import entities from './Entities';
import { User } from './Entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { AtStrategy } from './strategies/atStrategy';
import { RtStrategy } from './strategies/rtStrategy';
import { UserModule } from './user/user.module';
import { ImageModule } from './image/image.module';
import { AtStrategyWeb } from './strategies/atStrategy.web';
import { RtStrategyWeb } from './strategies/rtStrategy.web';
import { LoggerMiddleware } from './lib/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.S3.env'],
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
    TypeOrmModule.forFeature([User]),
    ClubModule,
    AuthModule,
    UserModule,
    ImageModule,
  ],
  providers: [AtStrategy, RtStrategy, AtStrategyWeb, RtStrategyWeb],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
