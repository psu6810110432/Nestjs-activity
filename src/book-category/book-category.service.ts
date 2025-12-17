import { Injectable, OnModuleInit,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository, DeleteResult,UpdateResult,FindOperator  } from 'typeorm';
import { CreateBookCategoryDto } from './dto/create-book-category.dto';
import { UpdateBookCategoryDto } from './dto/update-book-category.dto';
import { BookCategory } from './entities/book-category.entity';

@Injectable()
export class BookCategoryService implements OnModuleInit {
  constructor(
    @InjectRepository(BookCategory)
    private readonly repo: Repository<BookCategory>, 
  ) {}
  
  async onModuleInit() {
      const count = await this.repo.count();
      if (count === 0) {
          console.log('Seeding Book Categories...');
          await this.repo.save([
            { name: 'Fiction', description: 'Stories and novels' },
            { name: 'Technology', description: 'Computers and engineering' },
            { name: 'History', description: 'Past events' }
          ]);
      }
  }

  
  async create(createDto: CreateBookCategoryDto): Promise<BookCategory> {
    return this.repo.save(createDto);
  }

  async findAll(): Promise<BookCategory[]> {
    return this.repo.find();
  }
  
  async findOne(id: string): Promise<BookCategory> { 
    const category = await this.repo.findOneBy({ id: id as any });
    if (!category) {
      throw new NotFoundException(`Book Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: string, updateDto: UpdateBookCategoryDto): Promise<UpdateResult> {
    const result = await this.repo.update(id, updateDto);

    if (result.affected === 0) {
      throw new NotFoundException(`Book Category with ID ${id} not found and cannot be updated`);
    }
    
    return result;
  }

  async remove(id: string): Promise<DeleteResult> {
    const result = await this.repo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Book Category with ID ${id} not found and cannot be deleted`);
    }

    return result;
  }
}
