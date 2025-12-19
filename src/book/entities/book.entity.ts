import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { BookCategory } from '../../book-category/entities/book-category.entity';
import { User } from '../../users/entities/user.entity'; // ตรวจสอบ Path ให้ถูกต้อง

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  likeCount: number;

  @ManyToOne(() => BookCategory, (category) => category.id)
  category: BookCategory;

  @Column({ nullable: true })
  categoryId: string;

  // เพิ่มความสัมพันธ์ Many-to-Many กับ User
  // @JoinTable() จำเป็นต้องใส่ไว้ที่ฝั่งที่เป็น Owner ของความสัมพันธ์ (เลือกฝั่งใดฝั่งหนึ่ง)
  @ManyToMany(() => User, (user) => user.likedBooks)
  @JoinTable({ name: 'book_likes' }) // สามารถตั้งชื่อตารางกลางได้ตามต้องการ
  likedBy: User[];
}