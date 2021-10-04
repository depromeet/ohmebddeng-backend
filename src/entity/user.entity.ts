import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { UserLevel } from './user_level.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  anonymousId: string;

  @Column({ nullable: true })
  appleId: string;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  kakaoId: string;

  @Column({ nullable: true })
  naverId: string;

  @Column({ nullable: true })
  facebookId: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  nickname: string;

  @Column({ nullable: true })
  profileImageUrl: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: string;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: string;

  @DeleteDateColumn({ type: 'datetime' })
  deletedAt: string;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column()
  role: string;

  @ManyToOne(() => UserLevel)
  userLevel!: UserLevel;
}
