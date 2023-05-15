import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri:
          configService.getOrThrow<string>('app.nodeEnv') === 'test'
            ? configService.getOrThrow<string>('mongo.testUri')
            : configService.getOrThrow<string>('mongo.uri'),
      }),
    }),
  ],
  providers: [DatabaseService, ConfigService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
