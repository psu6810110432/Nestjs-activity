import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../entities/user.entity'; // Import Enum มาใช้

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(UserRole) // ตรวจสอบว่าค่าที่ส่งมาต้องอยู่ใน Enum เท่านั้น
  @IsOptional()
  role?: UserRole;
}