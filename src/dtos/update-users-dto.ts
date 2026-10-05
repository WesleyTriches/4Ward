import {
  IsEmail,
  IsNotEmpty,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @Length(3, 100)
  name!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;
}