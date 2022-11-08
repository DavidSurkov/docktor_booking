import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { Doctor, DoctorDocument } from 'src/schemas/doctor.schema';
import {
  Appointment,
  AppointmentDocument,
} from 'src/schemas/appointment.schema';
import { CreateAppointmentDto } from 'src/modules/appointment/dto/create-appointment.dto';
import { NotificationService } from 'src/modules/notification/notification.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
    @InjectModel(Appointment.name)
    private appointmentModel: Model<AppointmentDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly notificationService: NotificationService,
  ) {}

  async createAppointment(
    appointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    if (appointmentDto.date < new Date()) {
      throw new HttpException('Date should not be in past', 400);
    }
    const dayStart = new Date(appointmentDto.date).setHours(0, 0, 0);
    const dayEnd = new Date(appointmentDto.date).setHours(23, 59, 59);

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const newAppointment = new this.appointmentModel({
        ...appointmentDto,
        active: false,
      });

      const currentDayAppointments = await this.appointmentModel.find(
        {
          doctor: appointmentDto.doctor,
          active: true,
          date: {
            $gte: dayStart,
            $lte: dayEnd,
          },
        },
        {},
        { strictQuery: 'throw' },
      );

      if (currentDayAppointments.length >= 3) {
        throw new HttpException('Doctor is fully booked for this day', 400);
      }

      const savedAppointment = await newAppointment.save();

      await session.commitTransaction();
      return savedAppointment;
    } catch (error) {
      await session.abortTransaction();
      if (error instanceof HttpException) {
        throw new HttpException(error.message, error.getStatus());
      } else
        throw new InternalServerErrorException({
          error: error.message,
          status: 500,
        });
    } finally {
      await session.endSession();
    }
  }

  async findDoctorPendingAppointments(
    doctorId: string,
  ): Promise<Appointment[]> {
    try {
      return await this.appointmentModel.find({
        doctor: doctorId,
        active: false,
      });
    } catch (error) {
      throw error;
    }
  }

  async acceptAppointment(id: string): Promise<void> {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const foundAppointment = await this.appointmentModel.findOneAndUpdate(
        { _id: id, active: false },
        { $set: { active: true } },
      );
      if (!foundAppointment) {
        throw new HttpException('Appointment is already active', 400);
      }
      const doctor = await this.doctorModel.findByIdAndUpdate(
        foundAppointment.doctor,
        {
          $push: { appointments_accepted: foundAppointment },
        },
      );
      const user = await this.userModel.findByIdAndUpdate(
        foundAppointment.user,
        {
          $push: { appointments: foundAppointment },
        },
      );
      await session.commitTransaction();

      await this.notificationService.createCronNotification(
        foundAppointment._id.toString(),
        user.name,
        doctor.spec,
        foundAppointment.date,
      );
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async rejectAppointment(id: string) {
    try {
      const appointment = await this.appointmentModel.findById({ _id: id });
      await appointment.delete();
    } catch (error) {
      throw error;
    }
  }
}
