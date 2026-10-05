import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  authors: string;

  @Column({ nullable: true })
  favorite: string;

  @Column({ nullable: true })
  fileCover: string;

  @Column({ nullable: true })
  fileName: string;

  @Column({ nullable: true })
  fileBook: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
