import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
// import { DoesExist } from '../../utils/validators/does-exist.validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class AuthEmailLoginDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  // @Validate(DoesExist, ['User'], {
  //   message: 'emailNotExists',
  // })
  email: string;

  @ApiProperty({ example: 'test123' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
