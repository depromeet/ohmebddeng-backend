import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserLevel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  description: string;
}
