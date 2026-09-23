import { IsDateString } from 'class-validator';

export class CreateScheduleDto {
  @IsDateString()
  dateTime!: string;
}