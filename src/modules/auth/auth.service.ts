import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { Doctor, DoctorDocument } from 'src/schemas/doctor.schema';
import { RegisterUserDto } from 'src/modules/auth/dto/register-user.dto';
import { RegisterDoctorDto } from 'src/modules/auth/dto/register-doctor.dto';
import { RoleEnum } from 'src/utils/enums';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
  ) {}

  async createUser(userDto: RegisterUserDto): Promise<User> {
    try {
      const createdUser = new this.userModel({
        ...userDto,
        type: RoleEnum.USER,
      });
      return await createdUser.save();
    } catch (error) {
      this.throwError(error, 'Error occurred while trying create a user');
    }
  }

  async createDoctor(doctorDto: RegisterDoctorDto) {
    try {
      const createdDoctor = new this.doctorModel({
        ...doctorDto,
        type: RoleEnum.DOCTOR,
        free: true,
      });
      return await createdDoctor.save();
    } catch (error) {
      this.throwError(error, 'Error occurred while trying create a doctor');
    }
  }

  private throwError(error: any, message: string) {
    Logger.error(message);
    if (error instanceof HttpException) {
      throw new HttpException(error.message, error.getStatus());
    }
    if (error.message) {
      throw new HttpException(error.message, 500);
    } else throw new InternalServerErrorException();
  }
}
