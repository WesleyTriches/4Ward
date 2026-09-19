import {
    IsInt, IsPositive, IsString, Length, IsOptional, IsDateString,
    IsUrl, MaxLength
} from 'class-validator';
export class CreateProfileDto {
    @IsInt()
    @IsPositive()
    userId: number = 0; // vínculo obrigatório

    @IsString()
    @Length(2, 120)
    fullName: string = "";

    @IsOptional()
    @IsDateString()
    birthDate?: string; // ISO 8601 (ex: "1990-01-15T00:00:00Z")
    
    @IsOptional()
    @MaxLength(500)
    avatarUrl?: string;
}
