import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ description: '음식 id', type: String })
  id: string;

  @Column()
  @ApiProperty({ description: '음식 이름', type: String })
  name: string;

  @CreateDateColumn({ type: 'datetime' })
  @ApiProperty({ description: '음식 데이터가 만들어진 일자', type: Date })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  @ApiProperty({ description: '음식 데이터가 업데이트 된 일자', type: Date })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'datetime' })
  @ApiProperty({ description: '음식 데이터가 삭제 된 일자', type: Date })
  deletedAt: Date;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({
    description: '음식 데이터 삭제 여부',
    type: Boolean,
    default: false,
  })
  isDeleted: boolean;

  @Column({ nullable: true })
  @ApiProperty({ description: '음식 사진 URL', type: String, nullable: true })
  imageUrl: string;

  // 하나의 음식이 여러 카테고리, [ex) 떡볶이 => 한식, 분식]에 속할 수 있다고 가정
  @ManyToMany(() => Category, { nullable: false })
  @JoinTable({ name: 'food_category' })
  @ApiProperty({
    description: '음식 카테고리',
    type: [Category],
    nullable: false,
  })
  categories: Category[];

  @ManyToOne((type) => FoodLevel, (foodLevel) => foodLevel.foods)
  foodLevel: FoodLevel;

  // 한 음식점에 여러 음식이 속할 수 있다고 가정
  // restaurant
  @ManyToOne((type) => Restaurant, (restaurant) => restaurant.foods)
  @ApiProperty({ description: '음식을 판매하는 음식점 정보', type: Restaurant })
  restaurant: Restaurant;

  // review
  @OneToMany((type) => Review, (review) => review.food)
  @ApiProperty({ description: '음식에 저장 된 리뷰', type: [Review] })
  reviews: Review[];
}