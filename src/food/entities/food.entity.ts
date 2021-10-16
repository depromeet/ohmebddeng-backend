import { Review } from 'src/review/entities/review.entity';
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
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { FoodLevel } from './food_level.entity';
import { Restaurant } from './restaurant.entity';

@Entity()
export class Food {
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
  imageUrl: string;

  // 하나의 음식이 여러 카테고리, [ex) 떡볶이 => 한식, 분식]에 속할 수 있다고 가정
  @ManyToMany(() => Category, { nullable: false })
  @JoinTable({ name: 'food_category' })
  categories: Category[];

  @ManyToOne((type) => FoodLevel, (foodLevel) => foodLevel.foods)
  foodLevel: FoodLevel;

  // 한 음식점에 여러 음식이 속할 수 있다고 가정
  // restaurant
  @ManyToOne((type) => Restaurant, (restaurant) => restaurant.foods)
  restaurant: Restaurant;

  // review
  @OneToMany((type) => Review, (review) => review.food)
  reviews: Review[];
}
