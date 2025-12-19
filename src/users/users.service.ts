import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity'; // ตรวจสอบว่ามี Entity นี้อยู่จริง

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 1. Seeding: สร้าง Admin อัตโนมัติเมื่อ Module เริ่มทำงาน
  async onModuleInit() {
    const adminEmail = 'admin@bookstore.com';
    const admin = await this.findOneByEmail(adminEmail);
    
    if (!admin) {
      console.log('🚀 Seeding Admin User...');
      await this.create({
        email: adminEmail,
        password: 'adminpassword',
        // หากมี field role ใน User Entity ให้ใส่เพิ่มตรงนี้ เช่น role: 'admin'
      } as CreateUserDto);
    }
  }

  // 2. Modify Create: Hash password ก่อนบันทึก
  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    
    const user = this.userRepository.create({ 
      ...createUserDto, 
      password: hashedPassword 
    });
    return await this.userRepository.save(user);
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.userRepository.delete(id);
    return { deleted: true };
  }
}