import { ApiProperty } from '@nestjs/swagger';
export class TokenDto {
  @ApiProperty()
  readonly accessToken: string;
  readonly refreshToken: string;
}
