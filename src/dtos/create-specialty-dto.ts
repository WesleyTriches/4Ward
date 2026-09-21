import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateSpecialtyDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string = '';

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  icon?: string;
}