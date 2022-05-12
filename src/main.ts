import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AtGuard } from './auth/guards';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  const config = new DocumentBuilder()
    .setTitle('GCMS Api명세서')
    .setDescription('Api명세서들을 옮겨놨습니다')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        description: 'Enter JWT token',
      },
      'access-token',
    )
    .build();
  const options = {
    swaggerOptions: {
      authAction: {
        defaultBearerAuth: {
          name: 'access-token',
          schema: {
            description: 'Default',
            type: 'http',
            in: 'header',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
          value: 'thisIsASampleBearerAuthToken123',
        },
      },
    },
  };
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, options);
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new AtGuard(new Reflector()));

  await app.listen(4000);
}
bootstrap();
