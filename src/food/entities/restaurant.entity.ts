import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { Food } from './food.entity';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @ApiProperty({ description: '음식점 id', type: String })
  id: string;

  @Column()
  @ApiProperty({ description: '음식점 이름', type: String })
  name: string;

  @CreateDateColumn({ type: 'datetime' })
  @ApiProperty({ description: '음식점 데이터가 생성된 일자', type: Date })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  @ApiProperty({ description: '음식점 데이터가 업데이트 된 일자', type: Date })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'datetime' })
  @ApiProperty({ description: '음식점 데이터가 삭제된 일자', type: Date })
  deletedAt: Date;

  @Column({ type: 'boolean', default: false })
  @ApiProperty({
    description: '음식점 데이터가 삭제 여부 체크',
    type: Boolean,
    default: false,
  })
  isDeleted: boolean;

  @Column({ nullable: true })
  @ApiProperty({ description: '음식점 연락처', type: String, nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  @ApiProperty({ description: '음식점 주소', type: String, nullable: true })
  address: string;

  @Column({ type: 'double', nullable: true })
  @ApiProperty({
    description: '음식점 위치(위도)',
    type: Number,
    nullable: true,
  })
  mapX: number;

  @Column({ type: 'double', nullable: true })
  @ApiProperty({
    description: '음식점 위치(경도)',
    type: Number,
    nullable: true,
  })
  mapY: number;

  @Column({ nullable: true })
  @ApiProperty({
    description: '음식점 위치(네이버 지도 URL)',
    type: String,
    nullable: true,
  })
  naverMapUrl: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: '음식점 위치(카카오 지도 URL)',
    type: String,
    nullable: true,
  })
  kakaoMapUrl: string;

  @Column({ nullable: true })
  @ApiProperty({
    description: '음식점 이미지 URL',
    type: String,
    nullable: true,
  })
  imageUrl: string;

  // 하나의 음식점이 여러 카테고리, [ex) 국대떡볶이 => 한식, 분식]에 속할 수 있다고 가정
  @ManyToMany(() => Category)
  @JoinTable({ name: 'restaurant_category' })
  @ApiProperty({ description: '음식점 카테고리', type: [Category] })
  categories: Category[];

  // food
  @OneToMany((type) => Food, (food) => food.restaurant)
  @ApiProperty({ description: '음식점에서 판매하는 음식 리스트', type: [Food] })
  foods: Food[];
}
