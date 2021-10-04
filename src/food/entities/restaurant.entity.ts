import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column()
  name: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'datetime' })
  deletedAt: Date;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: 'double', nullable: true })
  mapX: number;

  @Column({ type: 'double', nullable: true })
  mapY: number;

  @Column({ nullable: true })
  naverMapUrl: string;

  @Column({ nullable: true })
  kakaoMapUrl: string;

  @Column({ nullable: true })
  imageUrl: string;

  // 하나의 음식점이 여러 카테고리, [ex) 국대떡볶이 => 한식, 분식]에 속할 수 있다고 가정
  @ManyToMany(() => Category)
  @JoinTable({ name: 'restaurant_category' })
  categories: Category[];
}
