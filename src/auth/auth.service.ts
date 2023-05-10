import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { LoginResponseType } from 'src/utils/types/auth/login-response.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async login(user: any) {
    const payload = {
      sub: user.userId,
      roles: user.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateLogin(
    loginDto: AuthEmailLoginDto,
    onlyAdmin: boolean,
  ): Promise<LoginResponseType> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new NotFoundException('Email not found');
    }

    if (onlyAdmin && !user.roles.includes('admin')) {
      throw new UnauthorizedException('Not enough permissions');
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: 'incorrectPassword',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const token = {
      tokenType: 'Bearer',
      accessToken: this.jwtService.sign({
        sub: user._id,
        roles: user.roles,
      }),
      refreshToken: 'TODO',
      expiresIn: new Date(
        new Date().getTime() +
          this.configService.get<number>('auth.expires') * 60000,
      ),
    };

    return { token, user: null };
  }
}
