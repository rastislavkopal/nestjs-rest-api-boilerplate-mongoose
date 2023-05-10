import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokeDto {
  @ApiProperty({ example: '645bc57ca9f31b9cbb2f865f' })
  @IsNotEmpty()
  // @Validate(DoesExist, ['User'], {
  //   message: 'emailNotExists',
  // })
  userId: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NDViYzU3Y2E5ZjMxYjljYmIyZjg2NWYiLCJfaWQiOiI2NDViYzU3Y2E5ZjMxYjljYmIyZjg2NWYiLCJyb2xlcyI6WyJ1c2VyIl0sImlhdCI6MTY4MzczNTkzMiwiZXhwIjoxNjgzOTE1OTMyfQ.29IdrDWlqs2eWU9V8uiU8VieduGfNz6hBzRfRU_Dlu0',
  })
  @IsNotEmpty()
  token: string;
}
