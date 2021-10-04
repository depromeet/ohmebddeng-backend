import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
} from 'typeorm';
import { FoodLevel } from './food_level.entity';
import { TasteTag } from './taste_tag.entity';

@Entity()
export class Review {
  @ManyToOne(() => FoodLevel)
  hotLevel: FoodLevel;

  @Column({ nullable: true })
  imageUrl: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: string;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: string;

  @DeleteDateColumn({ type: 'datetime' })
  deletedAt: string;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  // 하나의 리뷰에 맛에 대한 여러 맛평가 태그가 포함될 수 있어, ManyToMany로 설정함.
  @ManyToMany(() => TasteTag)
  tasteReviews: TasteTag[];
}
