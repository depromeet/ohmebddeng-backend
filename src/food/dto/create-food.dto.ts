import { IsBoolean, IsDate, IsString } from 'class-validator';

export class CreateFoodDto {
  @IsString()
  readonly id: string;

  @IsString()
  readonly name: string;

  @IsDate()
  readonly createdAt: Date;

  @IsDate()
  readonly deletedAt: Date;

  @IsBoolean()
  readonly isDeleted: boolean;

  @IsString()
  readonly imageUrl: string;
}
