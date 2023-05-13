import { IsNotEmpty, MinLength, MaxLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReplaceUserDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @MaxLength(128)
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: 'test123' })
  @MinLength(6)
  @MaxLength(128)
  @IsString()
  password?: string;

  @ApiProperty({ example: ['admin'] })
  roles?: string[];
}
