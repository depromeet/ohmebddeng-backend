import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Food } from './food.entity';

@Entity()
export class FoodLevel {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  description: string;

  // food
  @OneToMany((type) => Food, (food) => food.foodLevel)
  foods: Food[];
}
