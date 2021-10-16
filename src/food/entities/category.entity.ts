import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @ApiProperty({ description: '카테고리 id', type: String })
  id: string;

  @Column()
  @ApiProperty({ description: '카테고리 이름', type: String })
  name: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '카테고리 이미지 URL', type: String })
  imageUrl: string;
}
