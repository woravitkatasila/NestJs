import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class UpdateAgeDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  public age: number;
}
