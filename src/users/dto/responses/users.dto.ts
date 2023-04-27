import { ApiProperty } from '@nestjs/swagger';

export class UsersDto {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly user: string;
}
