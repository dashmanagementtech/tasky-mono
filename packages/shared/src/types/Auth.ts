import { IsEmail, Min } from "class-validator"

export interface ILoginData {
  email: string
  password: string
}

export class LoginDTO {
  @IsEmail()
  email!: string

  @Min(6)
  password!: string
}