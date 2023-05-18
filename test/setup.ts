import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { AuthModule } from '../src/auth/auth.module';
import { UsersModule } from '../src/users/users.module';
import { Test } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { Connection } from 'mongoose';
import { DatabaseService } from '../src/database/database.service';
import validationOptions from '../src/utils/validation-options';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../src/database/database.module';

export let app: NestExpressApplication;
export let dbConnection: Connection;
export let httpServer: any;

async function initServer() {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule, AuthModule, UsersModule, ConfigModule, DatabaseModule],
  }).compile();

  app = moduleRef.createNestApplication<NestExpressApplication>();

  // const configService = app.get(ConfigService<AllConfigType>);
  app.enableShutdownHooks();
  //added for custom validator
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  await app.init();
  dbConnection = moduleRef.get<DatabaseService>(DatabaseService).getDbHandle();
  httpServer = app.getHttpServer();
  await app.listen(6599);
}

global.beforeAll(async () => {
  await initServer();
});

global.afterAll(async () => {
  await dbConnection.close();
  await app.close();
});
