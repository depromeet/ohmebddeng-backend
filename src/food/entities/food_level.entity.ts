import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FoodLevel {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @ApiProperty({ description: '음식 레벨 id', type: String })
  id: string;

  @Column()
  @ApiProperty({ description: '음식 레벨 이름', type: String })
  name: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: '음식 레벨 이미지 URL',
    type: String,
    nullable: true,
  })
  imageUrl: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '음식 레벨 설명', type: String, nullable: true })
  description: string;
}
