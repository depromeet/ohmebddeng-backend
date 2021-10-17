import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserRefreshToken {
  @PrimaryColumn()
  @ApiProperty({ description: '리프레시 토큰 값' })
  refreshToken: string;

  @Column({ type: 'datetime' })
  @ApiProperty({ description: '만료일' })
  expireAt: Date;

  @OneToOne(() => User, { nullable: false })
  @JoinColumn()
  @ApiProperty({ description: '사용자 정보' })
  user: User;
}
