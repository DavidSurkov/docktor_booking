import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from 'src/modules/auth/dto/register-user.dto';
import { AuthService } from 'src/modules/auth/auth.service';
import { RegisterDoctorDto } from 'src/modules/auth/dto/register-doctor.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('user')
  registerUser(@Body() userDto: RegisterUserDto) {
    return this.authService.createUser(userDto);
  }

  @Post('doctor')
  registerDoctor(@Body() doctorDto: RegisterDoctorDto) {
    return this.authService.createDoctor(doctorDto);
  }
}
