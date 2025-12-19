import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { Book } from './entities/book.entity';
import { User } from '../users/entities/user.entity'; // 👈 1. Import User Entity เข้ามา

@Module({
  imports: [
    // 👈 2. เพิ่ม User เข้าไปใน array ตรงนี้
    TypeOrmModule.forFeature([Book, User]) 
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}