import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  // ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { User } from '../users/schemas/user.schema';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthResponseType } from '../utils/types/auth/auth-response.type';
import MongooseClassSerializerInterceptor from '../utils/interceptors/mongoose-class-serializer.interceptor';
import { RolesGuard } from '../auth/guards/roles.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() createUserDto: CreateUserDto): Promise<AuthResponseType> {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public login(@Body() loginDto: AuthEmailLoginDto): Promise<AuthResponseType> {
    return this.authService.login(loginDto, false);
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.CREATED)
  // @ApiOperation({ title: 'Refresh Access Token with refresh token' })
  @ApiCreatedResponse({})
  async refreshAccessToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseType> {
    return this.authService.refreshAccessToken(refreshTokenDto);
  }

  @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  // @Roles('user')
  @Get('profile')
  getProfile(@Request() req): User {
    return req.user;
  }
}
