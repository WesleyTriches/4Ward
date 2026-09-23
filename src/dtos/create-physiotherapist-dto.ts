import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { ServiceMode } from 'src/generated/prisma/enums';

export class CreatePhysiotherapistDto {
  @IsInt()
  specialtyId!: number;

  @IsString()
  @IsNotEmpty()
  crefito!: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsNumber()
  @Min(0)
  sessionPrice!: number;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsEnum(ServiceMode)
  serviceMode!: ServiceMode;

  @IsInt()
  @Min(0)
  experienceYears!: number;
}