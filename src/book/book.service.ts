import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './entities/book.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private repo: Repository<Book>,
    @InjectRepository(User)
    private userRepo: Repository<User>, // อย่าลืม Inject UserRepo เพื่อหา User มาเชื่อมความสัมพันธ์
  ) {}

  // --- New Logic: Toggle Like (Many-to-Many) ---
  async toggleLike(bookId: string, userId: number) {
    // 1. ค้นหาหนังสือพร้อมโหลดความสัมพันธ์ likedBy
    const book = await this.repo.findOne({
      where: { id: bookId },
      relations: ['likedBy'],
    });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    // 2. ตรวจสอบว่า User คนนี้เคย Like ไปหรือยัง
    const userIndex = book.likedBy.findIndex((user) => user.id === userId);

    if (userIndex > -1) {
      // ถ้ามีอยู่แล้ว -> ลบออก (Unlike)
      book.likedBy.splice(userIndex, 1);
      book.likeCount = Math.max(0, book.likeCount - 1);
    } else {
      // ถ้ายังไม่มี -> ค้นหา User และเพิ่มเข้าไป (Like)
      const user = await this.userRepo.findOneBy({ id: userId });
      if (user) {
        book.likedBy.push(user);
        book.likeCount += 1;
      }
    }

    // 3. บันทึกความเปลี่ยนแปลง (TypeORM จะจัดการ Junction Table ให้เอง)
    return this.repo.save(book);
  }

  // --- CRUD มาตรฐาน ---
  create(createBookDto: CreateBookDto) {
    return this.repo.save(createBookDto);
  }

  findAll() {
    return this.repo.find({ relations: ['category', 'likedBy'] });
  }

  async findOne(id: string) {
    const book = await this.repo.findOne({
      where: { id },
      relations: ['category', 'likedBy'],
    });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  update(id: string, updateBookDto: UpdateBookDto) {
    return this.repo.update(id, updateBookDto);
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}