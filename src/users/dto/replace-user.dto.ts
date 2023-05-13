import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Validate,
  IsString,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UniqueValidator } from '../../utils/validators/unique-validator';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class ReplaceUserDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @Validate(UniqueValidator, ['email'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @MaxLength(128)
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: 'test123' })
  @MinLength(6)
  @MaxLength(128)
  @IsString()
  password: string;

  @ApiProperty({ example: ['admin'] })
  @IsOptional()
  roles?: string[];
}
