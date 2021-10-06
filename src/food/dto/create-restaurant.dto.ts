import { IsBoolean, IsNumber, IsString, IsDate } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsDate()
  deletedAt: Date;

  @IsBoolean()
  isDeleted: boolean;

  @IsString()
  phoneNumber: string;

  @IsString()
  address: string;

  @IsNumber()
  mapX: number;

  @IsNumber()
  mapY: number;

  @IsString()
  naverMapUrl: string;

  @IsString()
  kakaoMapUrl: string;

  @IsString()
  imageUrl: string;
}
