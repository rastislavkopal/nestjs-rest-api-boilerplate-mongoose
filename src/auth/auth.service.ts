import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthResponseType } from '../utils/types/auth/auth-response.type';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../users/dto/create-user.dto';
import {
  RefreshToken,
  RefreshTokenDocument,
} from './schemas/refresh-token.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../users/schemas/user.schema';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  private jwtExpires: number;

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
    @InjectModel(RefreshToken.name) private tokenModel: Model<RefreshToken>,
  ) {
    this.jwtExpires = this.configService.get<number>('auth.expires');
  }

  async createAccessToken(user: User): Promise<string> {
    const accessToken: string = this.jwtService.sign({
      sub: user._id,
      _id: user._id,
      roles: user.roles,
    });
    return accessToken;
  }

  async createRefreshToken(user: User): Promise<string> {
    const refreshToken: RefreshTokenDocument = new this.tokenModel({
      userId: user._id,
      refreshToken: `${user._id}.${randomBytes(40).toString('hex')}`,
      email: user.email,
    });
    await refreshToken.save();
    return refreshToken.refreshToken;
  }

  async findRefreshToken(user: User): Promise<string> {
    const refreshToken: RefreshToken = await this.tokenModel.findOne({
      userId: user._id,
      email: user.email,
    });
    if (!refreshToken) {
      throw new UnauthorizedException('User has been logged out.');
    }
    return refreshToken.refreshToken;
  }

  async authTokenResponse(user: User) {
    const tokenRes: AuthResponseType = {
      token: {
        tokenType: 'Bearer',
        accessToken: await this.createAccessToken(user),
        refreshToken: await this.findRefreshToken(user),
        expiresIn: new Date(new Date().getTime() + this.jwtExpires * 60000),
      },
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        email: user.email,
        level: user.level,
        roles: user.roles,
        nReviews: user.nReviews,
        nBeenVoted: user.nBeenVoted,
        updatedAt: user.updatedAt,
      },
    };
    return tokenRes;
  }

  async login(loginDto: AuthEmailLoginDto): Promise<AuthResponseType> {
    const user: User = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new NotFoundException('Email not found');
    }

    const isValidPassword: boolean = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'incorrectPassword',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.authTokenResponse(user);
  }

  async register(createUserDto: CreateUserDto): Promise<AuthResponseType> {
    const user: User = await this.usersService.create(createUserDto);
    await this.createRefreshToken(user);
    return this.authTokenResponse(user);
  }

  async refreshAccessToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseType> {
    const refreshToken: RefreshToken = await this.tokenModel.findOne({
      email: refreshTokenDto.email,
      refreshToken: refreshTokenDto.refreshToken,
    });
    if (!refreshToken) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid refresh token',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const user: User = await this.usersService.findOne({
      _id: refreshToken.userId,
    });
    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Invalid refresh token',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return this.authTokenResponse(user);
  }

  // ***********************
  // ╔╦╗╔═╗╔╦╗╦ ╦╔═╗╔╦╗╔═╗
  // ║║║║╣  ║ ╠═╣║ ║ ║║╚═╗
  // ╩ ╩╚═╝ ╩ ╩ ╩╚═╝═╩╝╚═╝
  // ***********************
  // returnJwtExtractor() {
  //   return this.jwtExtractor;
  // }

  // getIp(req: Request): string {
  //   return getClientIp(req);
  // }

  // getBrowserInfo(req: Request): string {
  //   return req.header['user-agent'] || 'XX';
  // }

  // getCountry(req: Request): string {
  //   return req.header['cf-ipcountry'] ? req.header['cf-ipcountry'] : 'XX';
  // }

  // encryptText(text: string): string {
  //   return this.cryptr.encrypt(text);
  // }
}
