import {
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  ParseUUIDPipe,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { NullableType } from '../utils/types/nullable.type';
import MongooseClassSerializerInterceptor from '../utils/interceptors/mongoose-class-serializer.interceptor';

@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @SerializeOptions({
  //   groups: ['admin'],
  // })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  // @SerializeOptions({
  //   groups: ['admin'],
  // })
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<User[]> {
    if (limit > 50) {
      limit = 50;
    }
    const users = await this.usersService.findManyWithPagination({
      page,
      limit,
    });
    return users;
  }

  // @SerializeOptions({
  //   groups: ['admin'],
  // })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<NullableType<User>> {
    return this.usersService.findById(id);
  }
}
