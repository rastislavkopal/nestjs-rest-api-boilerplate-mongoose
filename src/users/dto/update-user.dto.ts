import { PartialType } from '@nestjs/mapped-types';
import { ReplaceUserDto } from './replace-user.dto';

export class UpdateUserDto extends PartialType(ReplaceUserDto) {}
