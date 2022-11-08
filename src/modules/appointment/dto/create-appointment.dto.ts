import { IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAppointmentDto {
  @Type(() => Date)
  @IsDate()
  date: Date;

  @IsString()
  user: string;

  @IsString()
  doctor: string;
}
