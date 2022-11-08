import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { HydratedDocument, ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';
import { Doctor } from './doctor.schema';
import { User } from './user.schema';

export type AppointmentDocument = HydratedDocument<Appointment>;

@Schema()
export class Appointment {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  date: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' })
  doctor: Doctor;

  @Prop()
  active: boolean;
}
export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
