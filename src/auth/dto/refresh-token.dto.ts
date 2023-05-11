import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class RefreshTokenDto {
  // @ApiProperty({ example: '645bc57ca9f31b9cbb2f865f' })
  // @IsNotEmpty()
  // @Validate(DoesExist, ['User'], {
  //   message: 'emailNotExists',
  // })
  // userId: string;

  @ApiProperty({ example: 'test@gmail.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NDViYzU3Y2E5ZjMxYjljYmIyZjg2NWYiLCJfaWQiOiI2NDViYzU3Y2E5ZjMxYjljYmIyZjg2NWYiLCJyb2xlcyI6WyJ1c2VyIl0sImlhdCI6MTY4MzczNTkzMiwiZXhwIjoxNjgzOTE1OTMyfQ.29IdrDWlqs2eWU9V8uiU8VieduGfNz6hBzRfRU_Dlu0',
  })
  @IsNotEmpty()
  refreshToken: string;
}
