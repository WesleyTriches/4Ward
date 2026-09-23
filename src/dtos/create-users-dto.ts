import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';

import { UserRole } from 'src/generated/prisma/enums';

export class CreateUserDTO {
  @IsNotEmpty()
  @Length(3, 100)
  name!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}