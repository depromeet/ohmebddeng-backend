import { User } from '../../user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
} from 'typeorm';
import { Food } from '../../food/entities/food.entity';
import { FoodLevel } from '../../food/entities/food_level.entity';
import { TasteTag } from './taste_tag.entity';

@Entity()
export class Review {
  @ManyToOne(() => FoodLevel, { nullable: false })
  hotLevel: FoodLevel;

  @Column({ nullable: true })
  imageUrl: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'datetime' })
  deletedAt: Date;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  // 하나의 리뷰에 맛에 대한 여러 맛평가 태그가 포함될 수 있어, ManyToMany로 설정함.
  @ManyToMany(() => TasteTag)
  tasteReviews: TasteTag[];

  // Food
  @ManyToOne(() => Food, { primary: true })
  food: Food;

  // User
  @ManyToOne(() => User, { primary: true })
  user: User;
}
