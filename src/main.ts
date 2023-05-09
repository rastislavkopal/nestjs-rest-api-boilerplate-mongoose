import {
  // ClassSerializerInterceptor,
  ValidationPipe,
  // VersioningType,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import validationOptions from './utils/validation-options';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  mongoose.set('debug', true); // TODO remove logging in deployment

  await app.listen(3000);
}

bootstrap();
