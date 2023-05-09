import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { AppModule } from './app.module';
import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { AllConfigType } from './config/config.type';
import validationOptions from './utils/validation-options';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService<AllConfigType>);

  app.enableShutdownHooks();
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: ['/'],
    },
  );
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  mongoose.set(
    // setup mongoose logger for dev mode only
    'debug',
    configService.getOrThrow<string>('app.nodeEnv', { infer: true }) ===
      'development',
  );

  await app.listen(3000);
}

bootstrap();
