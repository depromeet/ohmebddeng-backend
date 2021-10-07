import { IsString } from 'class-validator';

export class CreateFoodDto {
  @IsString()
  readonly name: string;
}
