import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateAppointmentDto {
  //id
  @IsInt()
  scheduleId!: number;
  //motivo do atendimento
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;

  //escala da dor de 0 a 10 
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10)
  painLevel?: number;
}