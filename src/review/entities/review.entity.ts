import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Food } from '../../food/entities/food.entity';
import { FoodLevel } from '../../food/entities/food_level.entity';
import { TasteTag } from './taste_tag.entity';

@Entity()
export class Review {
  @ManyToOne(() => FoodLevel, { nullable: false })
  @ApiProperty({ description: '리뷰에서 사용자가 평가한 맵레벨'})
  hotLevel: FoodLevel;

  @Column({ nullable: true })
  @ApiProperty({ description: '음식의 이미지 url'})
  imageUrl: string;

  @CreateDateColumn({ type: 'datetime' })
  @ApiProperty({ description: '리뷰가 생성된 시간'})
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  @ApiProperty({ description: '리뷰가 수정된 시간'})
  updatedAt: Date;

  @DeleteDateColumn({ type: 'datetime' })
  @ApiProperty({ description: '리뷰가 삭제된 시간'})
  deletedAt: Date;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({ description: '리뷰가 삭제되었는지 여부'})
  isDeleted: boolean;

  // 하나의 리뷰에 맛에 대한 여러 맛평가 태그가 포함될 수 있어, ManyToMany로 설정함.
  @ManyToMany(() => TasteTag, {nullable: false})
  @JoinTable({ name: 'review_taste_tag'})
  @ApiProperty({ description: '리뷰에서 음식의 맛 평가 태그'})
  tasteReviews: TasteTag[];

  // Food
  @ManyToOne(() => Food, (food) => food.reviews, { primary: true })
  @ApiProperty({ description: '리뷰대상 음식'})
  food: Food;

  // User
  @ManyToOne(() => User, (user) => user.reviews, { primary: true })
  @ApiProperty({ description: '리뷰를 한 유저'})
  user: User;
}