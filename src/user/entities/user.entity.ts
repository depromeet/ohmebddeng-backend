import { ApiProperty } from '@nestjs/swagger';
import { Review } from 'src/review/entities/review.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserLevel } from './user_level.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @ApiProperty({
    description: '사용자 id. BIGINT 타입이라 JS에서는 string 취급',
  })
  id: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '익명사용자용 id', nullable: true })
  anonymousId: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Apple id', nullable: true })
  appleId: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Google id', nullable: true })
  googleId: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Kakao id', nullable: true })
  kakaoId: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Naver id', nullable: true })
  naverId: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Facebook id', nullable: true })
  facebookId: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'email', nullable: true })
  email: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'password', nullable: true })
  password: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '별명', nullable: true })
  nickname: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '프로필 이미지', nullable: true })
  profileImageUrl: string;

  @CreateDateColumn({ type: 'datetime' })
  @ApiProperty({ description: '생성 일자' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  @ApiProperty({ description: '업데이트 일자' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'datetime' })
  @ApiProperty({ description: '삭제 일자' })
  deletedAt: Date;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({ description: '삭제여부' })
  isDeleted: boolean;

  @Column({ nullable: true })
  @ApiProperty({ description: '사용자의 권한' })
  role: string;

  @ManyToOne(() => UserLevel)
  @ApiProperty({ description: '사용자의 맵레벨', type: () => UserLevel })
  userLevel!: UserLevel;

  // review
  @OneToMany(() => Review, (review) => review.user)
  @ApiProperty({ description: '사용자가 작성한 리뷰 리스트' })
  reviews: Review[];
}
