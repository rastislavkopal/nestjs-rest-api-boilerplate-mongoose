import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthResponseType } from 'src/utils/types/auth/auth-response.type';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { RefreshToken } from './schemas/refresh-token.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
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
    const accessToken = this.jwtService.sign({
      sub: user._id,
      _id: user._id,
      roles: user.roles,
    });
    return accessToken;
  }

  async createRefreshToken(user): Promise<string> {
    const refreshToken = new this.tokenModel({
      userId: user._id,
      refreshToken: `${user._id}.${randomBytes(40).toString('hex')}`,
      email: user.email,
    });
    await refreshToken.save();
    return refreshToken.refreshToken;
  }

  async findRefreshToken(user: User): Promise<string> {
    const refreshToken = await this.tokenModel.findOne({
      userId: user._id,
      email: user.email,
    });
    if (!refreshToken) {
      throw new UnauthorizedException('User has been logged out.');
    }
    return refreshToken.refreshToken;
  }

  async authTokenResponse(user) {
    const token = {
      tokenType: 'Bearer',
      accessToken: await this.createAccessToken(user),
      refreshToken: await this.findRefreshToken(user),
      expiresIn: new Date(new Date().getTime() + this.jwtExpires * 60000),
    };
    return { token, user: null };
  }

  async login(
    loginDto: AuthEmailLoginDto,
    onlyAdmin: boolean,
  ): Promise<AuthResponseType> {
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

    return this.authTokenResponse(user);
  }

  async register(createUserDto: CreateUserDto): Promise<AuthResponseType> {
    const user = await this.usersService.create(createUserDto);
    await this.createRefreshToken(user);
    return this.authTokenResponse(user);
  }

  async refreshAccessToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseType> {
    const refreshToken = await this.tokenModel.findOne({
      email: refreshTokenDto.email,
      refreshToken: refreshTokenDto.refreshToken,
    });
    if (!refreshToken) {
      throw new BadRequestException('Bad request');
    }
    const user = await this.usersService.findOne({ _id: refreshToken.userId });
    if (!user) {
      throw new BadRequestException('Bad request');
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
