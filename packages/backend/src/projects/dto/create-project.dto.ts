import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  startDate!: Date;

  @IsString()
  endDate!: Date;

  @IsString()
  cuid!: string;

  @IsString()
  type!: string;
}
