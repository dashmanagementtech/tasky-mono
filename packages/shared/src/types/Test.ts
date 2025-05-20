export interface IUser {
  id: string,
  email: string,
  name:string
}

import { IsUUID, IsEmail, Length } from "class-validator"

export class UserDTO {
  @IsUUID()
  id!: string;

  @Length(2, 50)
  name!: string;

  @IsEmail()
  email!: string
}