import { Transform } from 'class-transformer';
import { ObjectId, HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RoleEnum } from 'src/utils/enums';
import * as mongoose from 'mongoose';
import { Appointment } from 'src/schemas/appointment.schema';

export type DoctorDocument = HydratedDocument<Doctor>;

@Schema()
export class Doctor {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ unique: true })
  email: string;

  @Prop()
  reg_token?: string;

  @Prop()
  photo_avatar?: string;

  @Prop()
  phone: string;

  @Prop()
  name: string;

  @Prop()
  type: RoleEnum.DOCTOR;

  @Prop({ lowercase: true })
  spec: string;

  @Prop()
  free: boolean;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
  })
  appointments_accepted?: Appointment[];
}
export const DoctorSchema = SchemaFactory.createForClass(Doctor);
