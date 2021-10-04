import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserRefreshToken {
  @PrimaryColumn()
  refreshToken: string;

  @Column({ type: 'datetime' })
  expireAt: Date;

  @OneToOne(() => User)
  @JoinColumn()
  user: number;
}
