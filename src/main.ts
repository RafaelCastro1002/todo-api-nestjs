require('dotenv').config();

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { runDbMigrations } from './shared/utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      /**
       * Strip away all none-object existing properties
       */
      whitelist: true,
      /***
       * Transform input objects to their corresponding DTO objects
       */
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Todos API')
    .setDescription('Api para cadastro de usuário e criação de Todos')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('Todos')
    .addTag('Hello my app')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Todos API Docs',
  };

  SwaggerModule.setup('api', app, document, customOptions);

  await runDbMigrations();
  await app.listen(3000);
}
bootstrap();
