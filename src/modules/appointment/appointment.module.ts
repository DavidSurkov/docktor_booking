import { Module } from '@nestjs/common';
import { AppointmentController } from 'src/modules/appointment/appointment.controller';
import { AppointmentService } from 'src/modules/appointment/appointment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Doctor, DoctorSchema } from 'src/schemas/doctor.schema';
import { Appointment, AppointmentSchema } from 'src/schemas/appointment.schema';
import { NotificationModule } from 'src/modules/notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Doctor.name, schema: DoctorSchema },
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
    NotificationModule,
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}
