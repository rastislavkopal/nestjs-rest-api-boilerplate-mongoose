import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { User } from '../users/schemas/user.schema';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthResponseType } from '../utils/types/auth/auth-response.type';
import MongooseClassSerializerInterceptor from '../utils/interceptors/mongoose-class-serializer.interceptor';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Public } from './decorators/public-route.decorator';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() createUserDto: CreateUserDto): Promise<AuthResponseType> {
    return this.authService.register(createUserDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  public login(@Body() loginDto: AuthEmailLoginDto): Promise<AuthResponseType> {
    return this.authService.login(loginDto);
  }

  @Public()
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
  @Get('profile')
  @UseInterceptors(MongooseClassSerializerInterceptor(User))
  getProfile(@Request() req): User {
    return req.user;
  }
}
