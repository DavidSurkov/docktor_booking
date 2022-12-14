import { RegisterUserDto } from 'src/modules/auth/dto/register-user.dto';
import { IsString } from 'class-validator';

export class RegisterDoctorDto extends RegisterUserDto {
  @IsString()
  spec: string;
}
