import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UniqueValidator } from './utils/validators/unique-validator';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot('mongodb://localhost:27017/fact_checking_be'),
  ],
  controllers: [],
  providers: [UniqueValidator],
})
export class AppModule {}
