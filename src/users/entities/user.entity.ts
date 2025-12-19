import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// 1. Define the Enum
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

  // 2. Use the Enum in the Column decorator
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.ADMIN,
  })
  role: UserRole;
}
