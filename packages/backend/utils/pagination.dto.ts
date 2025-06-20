import { IsNumberString, IsString } from 'class-validator';

export class PaginationDto {
  @IsString()
  page!: number;

  @IsString()
  size!: number;
}

export class SearchDto {
  @IsString()
  query!: string;

  @IsNumberString()
  page!: string;

  @IsNumberString()
  size!: string;
}
