import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AppointmentService } from 'src/modules/appointment/appointment.service';
import { CreateAppointmentDto } from 'src/modules/appointment/dto/create-appointment.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  createAppointment(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentService.createAppointment(createAppointmentDto);
  }

  @Get('pending/:id')
  findDoctorPendingAppointments(@Param('id') id: string) {
    return this.appointmentService.findDoctorPendingAppointments(id);
  }

  @Patch(':id')
  acceptAppointment(@Param('id') id: string) {
    return this.appointmentService.acceptAppointment(id);
  }

  @Delete(':id')
  rejectAppointment(@Param('id') id: string) {
    return this.appointmentService.rejectAppointment(id);
  }
}
