import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadType } from '../../utils/types/auth/jwt-payload.type';
import { OrNeverType } from '../../utils/types/or-never.type';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.secret'),
    });
  }

  public async validate(payload: JwtPayloadType): Promise<OrNeverType<User>> {
    if (!payload._id) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findOne({ _id: payload._id });
    return user;
  }
}
