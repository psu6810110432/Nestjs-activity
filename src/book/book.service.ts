import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}
  create(createBookDto: CreateBookDto) {
    return 'This action adds a new book';
  }

  findAll() {
    return `This action returns all book`;
  }

  async findOne(id: string) { 
    const book = await this.bookRepository.findOneBy({ id });
    if (!book) {
      throw new NotFoundException(`Book #${id} not found`);
    }
    return book;
  }

  update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  remove(id: number) {
    return `This action removes a #${id} book`;
  }
  async incrementLikes(id: string) {
    const result = await this.bookRepository.increment({ id }, 'likeCount', 1);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Book #${id} not found`);
    }

    return this.findOne(id); 
  }
}
