import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    required: false,
  })
  @IsString()
  public page?: number;

  @ApiProperty({
    required: false,
  })
  @IsString()
  public pageLimit?: number;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  public sort?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  public sortBy?: string;

  @ApiProperty({
    required: false,
  })
  @IsString()
  @IsOptional()
  public search?: string;
}
