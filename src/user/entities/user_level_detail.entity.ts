import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserLevel } from './user_level.entity';

@Entity()
export class UserLevelDetail {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @ApiProperty({
    description: '사용자 레벨 상세 id. BIGINT 타입이라 JS에서는 string 취급',
  })
  id: string;

  @ManyToOne(() => UserLevel, (userLevel) => userLevel.userLevelDetail)
  @ApiProperty({ description: '사용자의 맵레벨', type: () => UserLevel })
  userLevel: UserLevel;

  @Column()
  @ApiProperty({ description: '사용자의 맵레벨에 맞는 특성' })
  characteristic: string;
}
