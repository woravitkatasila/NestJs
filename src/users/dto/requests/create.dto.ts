import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  public user: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  public accountId: number;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  public age: number;
}
