import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
} from 'class-validator';

export class FindReviewsQueryDto {
  @IsString()
  @ApiProperty({ description: '맵레벨 id 참고) (1)맵찔이, (2)맵초보, (3)맵러버, (4)맵마스터, (5)맵부심 ', required: true })
  userLevel : string;
}
