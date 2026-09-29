import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class RescheduleAppointmentDto {
  @IsInt()
  newScheduleId!: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}