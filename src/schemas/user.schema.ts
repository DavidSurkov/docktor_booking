import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';
import { Transform } from 'class-transformer';
import { RoleEnum } from 'src/utils/enums';
import { Appointment } from 'src/schemas/appointment.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ unique: true })
  email: string;

  @Prop()
  reg_token: string;

  @Prop()
  photo_avatar: string;

  @Prop()
  phone: string;

  @Prop()
  name: string;

  @Prop()
  type: RoleEnum.USER;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
  })
  appointments: Appointment[];
}

export const UserSchema = SchemaFactory.createForClass(User);
