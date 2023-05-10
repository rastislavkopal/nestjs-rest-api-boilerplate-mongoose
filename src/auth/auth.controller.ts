import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  // UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/schemas/user.schema';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { LoginResponseType } from 'src/utils/types/auth/login-response.type';
// import MongooseClassSerializerInterceptor from '../utils/interceptors/mongoose-class-serializer.interceptor';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
// @UseInterceptors(MongooseClassSerializerInterceptor(User))
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  public login(
    @Body() loginDto: AuthEmailLoginDto,
  ): Promise<LoginResponseType> {
    return this.authService.validateLogin(loginDto, false);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
