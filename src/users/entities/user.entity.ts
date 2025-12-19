import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Book } from '../../book/entities/book.entity'; // ตรวจสอบ Path ให้ถูกต้อง

export enum UserRole {
  USER = 'user',
  ADMIN = 'ADMIN',
  EDITOR = 'editor',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  // เพิ่มความสัมพันธ์ Many-to-Many กับ Book
  @ManyToMany(() => Book, (book) => book.likedBy)
  likedBooks: Book[];
}