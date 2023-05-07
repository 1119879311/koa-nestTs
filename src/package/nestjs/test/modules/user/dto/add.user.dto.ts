import { IsEmail, IsNotEmpty } from "class-validator";

export class AddUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  eamil: string;
}
