import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
// import { DoesExist } from 'src/utils/validators/does-exist.validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';

export class AuthEmailLoginDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  // @Validate(DoesExist, ['User'], {
  //   message: 'emailNotExists',
  // })
  email: string;

  @ApiProperty({ example: 'test123' })
  @IsNotEmpty()
  password: string;
}
