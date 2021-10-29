import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class TasteTag {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @ApiProperty({ description: '맛평가 태그의 id' })
  id: string;

  @Column()
  @ApiProperty({ description: '맛평가 태그의 이름' })
  name: string;

  @CreateDateColumn({ type: 'datetime' })
  @ApiProperty({ description: '맛평가 태그가 생성된 날짜' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  @ApiProperty({ description: '맛평가 태그가 수정된 날짜' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'datetime' })
  @ApiProperty({ description: '맛평가 태그가 제거된 날짜' })
  deletedAt: Date;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({ description: '맛평가 태그가 제거되었는지 여부' })
  isDeleted: boolean;
}
