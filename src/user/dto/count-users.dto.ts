import { IsBoolean, IsNumber } from 'class-validator';

export class CountUsersDto {
  @IsNumber()
  count: number; // Number타입: 9,007,199,254,740,991명 이하 사용자시 안전함. (9천조 명)

  @IsBoolean()
  levelTestedOnly: boolean;
}
