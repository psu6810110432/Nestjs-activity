import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // เพิ่มบรรทัดนี้
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { Book } from './entities/book.entity'; // ตรวจสอบ path ของ entity

@Module({
  imports: [
    // ลงทะเบียน Entity เพื่อสร้าง Repository ให้ Service เรียกใช้งานได้
    TypeOrmModule.forFeature([Book])
  ],
  controllers: [BookController],
  providers: [BookService],
  // ถ้าโมดูลอื่นต้องใช้ BookService อย่าลืม exports: [BookService]
})
export class BookModule {}