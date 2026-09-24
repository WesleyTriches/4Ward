import {
  IsString,
  Length,
  IsOptional,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @Length(2, 120)
  fullName!: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @MaxLength(500)
  avatarUrl?: string;
}