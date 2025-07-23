import { IsEmail, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  phoneNumber!: string;

  @IsString()
  company!: string;

  @IsString()
  industry!: string;

  @IsString()
  address!: string;
}
