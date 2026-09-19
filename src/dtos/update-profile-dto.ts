import { IsOptional, IsString, Length, IsDateString, IsUrl, MaxLength } from
    'class-validator';
export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    @Length(2, 120)
    fullName?: string;

    @IsOptional()
    @IsDateString()
    birthDate?: string;
    
    @IsOptional()
    @MaxLength(500)
    avatarUrl?: string;
}
