import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  @ApiProperty({ description: '사용자 레벨 설명', nullable: true })
  description: string;

  @Column()
  @ApiProperty({ description: '사용자 레벨' })
  level: number;
}
