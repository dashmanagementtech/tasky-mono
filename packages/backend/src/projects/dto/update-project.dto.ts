import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsString, IsUrl } from 'class-validator';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  @IsString()
  uid!: string;

  @IsString()
  userRole!: string;
}

export class AddProjectDocumentDto {
  @IsString()
  title!: string;

  @IsUrl()
  url!: string;
}
