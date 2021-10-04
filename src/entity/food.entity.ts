import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Category } from './category.entity';
import { Restaurant } from './restaurant.entity';

@Entity()
export class Food {
  @PrimaryGeneratedColumn()
  id: number;

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
  imageUrl: string;

  // 하나의 음식이 여러 카테고리, [ex) 떡볶이 => 한식, 분식]에 속할 수 있다고 가정
  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];

  // 한 음식점에 여러 음식이 속할 수 있다고 가정
  @ManyToOne(() => Restaurant)
  restaurant: Restaurant;
}
