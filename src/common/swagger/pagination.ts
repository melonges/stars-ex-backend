import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, Min } from 'class-validator';

export class PaginationMeta {
  @ApiProperty()
  page: number;
  @ApiProperty()
  perPage: number;
  @ApiProperty()
  totalPages: number;
  @ApiProperty()
  totalItems: number;
}

export class PaginatedResponse<T> {
  data: T[];
  @ApiProperty()
  meta: PaginationMeta;
}

export class PaginationDto {
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @ApiProperty({ description: 'page pagination starts from 0' })
  page: number;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @ApiProperty()
  perPage: number;
}
