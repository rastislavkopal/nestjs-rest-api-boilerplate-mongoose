import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UniqueValidator } from '../../utils/validators/unique-validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class CreateUserDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @Validate(UniqueValidator, ['email'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'test123' })
  @MinLength(6)
  @MaxLength(128)
  password?: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @MaxLength(128)
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'user' })
  // @Validate(IsExist, ['Role', 'id'], {
  //   message: 'roleNotExists',
  // })
  role: string | null;
}
