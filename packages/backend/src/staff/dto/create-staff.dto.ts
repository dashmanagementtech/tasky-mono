import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateStaffDto {
  @IsIn(['ADMIN', 'USER']) // Ensures 'role' is one of these two values
  role!: 'ADMIN' | 'USER';

  @IsString() // Ensures 'firstName' is a string
  @IsNotEmpty() // Ensures it's not an empty string
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsEmail()
  email!: string;
}
