import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Food } from './food.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserLevel } from 'src/user/entities/user_level.entity';

@Entity()
export class FoodLevel {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @ApiProperty({ description: '음식 레벨 id', type: String })
  id: string;

  @Column()
  @ApiProperty({ description: '음식 레벨 이름', type: String })
  name: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: '음식 레벨 이미지 URL',
    type: String,
    nullable: true,
  })
  imageUrl: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '음식 레벨 설명', type: String, nullable: true })
  description: string;

  // food
  @OneToMany(() => Food, (food) => food.foodLevel)
  foods: Food[];

  //userLevel
  @OneToOne(() => UserLevel)
  @JoinColumn()
  @ApiProperty({ description: '사용자 레벨' })
  userLevel: UserLevel;
}
