import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SigninDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  public email: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  public password: string;
}
