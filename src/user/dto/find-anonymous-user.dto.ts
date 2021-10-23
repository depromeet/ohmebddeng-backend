import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FindAnonymousUserDto {
  @IsString()
  @ApiProperty({ description: '사용자 id' })
  userId: string;

  @IsString()
  @ApiProperty({ description: '사용자의 익명 id' })
  anonymousId: string;
}
