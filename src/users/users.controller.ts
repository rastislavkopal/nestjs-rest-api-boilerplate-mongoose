import {
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  Param,
  UseInterceptors,
  UseGuards,
  SerializeOptions,
  Patch,
  Put,
  Delete,
  Res,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import {
  ApiTags,
  ApiQuery,
  ApiBearerAuth,
  ApiParam,
  ApiOperation,
  ApiBody,
} from '@nestjs/swagger';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { NullableType } from '../utils/types/nullable.type';
import MongooseClassSerializerInterceptor from '../utils/interceptors/mongoose-class-serializer.interceptor';
import { PaginationParams } from 'src/utils/types/pagination-params';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { ParseObjectIdPipe } from 'src/utils/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';
import { ReplaceUserDto } from './dto/replace-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { LoggedUser } from './decorators/logged-user.decorator';

@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
@UseGuards(RolesGuard)
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @SerializeOptions({ groups: ['admin'] })
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @SerializeOptions({ groups: ['admin'] })
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async findAll(@Query() { page, limit }: PaginationParams): Promise<User[]> {
    if (limit > 50) {
      limit = 50;
    }
    return await this.usersService.findManyWithPagination(page, limit);
  }

  @Get(':id')
  @SerializeOptions({ groups: ['admin'] })
  @ApiParam({ name: 'id', type: String, example: '645cacbfa6693d8100b2d60a' })
  @HttpCode(HttpStatus.OK)
  findOne(
    @Param('id', new ParseObjectIdPipe()) _id: Types.ObjectId,
  ): Promise<NullableType<User>> {
    return this.usersService.findOne({ _id });
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Updates specified fields of existing user' })
  @ApiBody({ type: ReplaceUserDto })
  @ApiParam({ name: 'id', type: String, example: '645cacbfa6693d8100b2d60a' })
  @SerializeOptions({ groups: ['admin'] })
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  update(
    @Param('id', new ParseObjectIdPipe()) _id: Types.ObjectId,
    @Body() userDto: UpdateUserDto,
    @LoggedUser() user: User,
  ): Promise<NullableType<User>> {
    return this.usersService.update(_id, user, userDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Replaces the whole user document by a new one' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: String, example: '645cacbfa6693d8100b2d60a' })
  @SerializeOptions({ groups: ['admin'] })
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  replace(
    @Param('id', new ParseObjectIdPipe()) _id: Types.ObjectId,
    @Body() userDto: ReplaceUserDto,
    @LoggedUser() user: User,
  ): Promise<NullableType<User>> {
    return this.usersService.replace(_id, user, userDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: String, example: '645cacbfa6693d8100b2d60a' })
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteStudent(
    @Param('id', new ParseObjectIdPipe()) _id: Types.ObjectId,
    @Res() res: Response,
  ) {
    try {
      const deletedUser = await this.usersService.delete(_id);
      return res.status(HttpStatus.NO_CONTENT).json({
        message: 'User deleted successfully',
        deletedUser,
      });
    } catch (err) {
      return res.status(err.status).json(err.response);
    }
  }
}
