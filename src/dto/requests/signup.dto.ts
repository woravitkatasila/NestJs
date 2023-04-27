import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class SignupDto {
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

  @ApiProperty({
    required: false,
  })
  @IsNotEmpty()
  public user: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  public age: number;

  // @ApiProperty({
  //   required: false,
  // })
  // @IsNotEmpty()
  // public lastToken?: string;

  // @ApiProperty({
  //   required: false,
  // })
  // @IsNotEmpty()
  // public status?: string;
}
