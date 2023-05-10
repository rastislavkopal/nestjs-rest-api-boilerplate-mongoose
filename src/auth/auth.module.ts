import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';

const jwtFactory = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get('auth.secret'),
    signOptions: {
      expiresIn: `${configService.get('auth.expires')}m`,
    },
  }),
};

@Module({
  imports: [UsersModule, PassportModule, JwtModule.registerAsync(jwtFactory)],
  providers: [
    AuthService,
    UsersService,
    JwtStrategy,
    AnonymousStrategy,
    ConfigService,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
