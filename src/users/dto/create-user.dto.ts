import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { UniqueValidator } from 'src/utils/validators/unique-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'test@test.com' })
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
