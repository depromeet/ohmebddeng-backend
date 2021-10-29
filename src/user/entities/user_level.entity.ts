import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserLevelDetail } from './user_level_detail.entity';

@Entity()
export class UserLevel {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @ApiProperty({ description: '사용자 레벨 ID' })
  id: string;

  @Column()
  @ApiProperty({ description: '사용자 레벨 이름' })
  name: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '사용자 레벨 이미지', nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '사용자 레벨 요약', nullable: true })
  summary: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '사용자 레벨 상세', nullable: true })
  description: string;

  @Column()
  @ApiProperty({ description: '사용자 레벨' })
  level: number;

  @OneToMany(
    () => UserLevelDetail,
    (userLevelDetail) => userLevelDetail.userLevel,
  )
  @ApiProperty({
    description: '사용자의 맵레벨에 해당하는 특성들',
    type: () => [UserLevelDetail],
  })
  userLevelDetail: UserLevelDetail[];
}
