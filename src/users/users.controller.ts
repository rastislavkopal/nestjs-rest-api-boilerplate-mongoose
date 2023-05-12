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
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
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

@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
@UseGuards(RolesGuard)
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @SerializeOptions({
  //   groups: ['admin'],
  // })
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  @ApiBearerAuth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  // @SerializeOptions({
  //   groups: ['admin'],
  // })
  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async findAll(@Query() { page, limit }: PaginationParams): Promise<User[]> {
    if (limit > 50) {
      limit = 50;
    }
    return await this.usersService.findManyWithPagination(page, limit);
  }

  // @SerializeOptions({
  //   groups: ['admin'],
  // })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(
    @Param('id', new ParseObjectIdPipe()) id: string,
  ): Promise<NullableType<User>> {
    return this.usersService.findById(id);
  }
}
