import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { HOT_LEVEL } from 'src/common/enums/hot-level';

export class Answer {
  @IsString()
  @ApiProperty({ description: '음식 id', type: String })
  foodId: string;

  @IsString()
  @ApiProperty({
    description: '음식의 매운정도에 대한 사용자의 평가',
    enum: HOT_LEVEL,
  })
  hotLevel: HOT_LEVEL;
}

export class updateUserLevelDto {
  @IsString()
  @ApiProperty({ description: '사용자 id', type: String })
  userId: string;

  @IsArray()
  @ApiProperty({
    description: '사용자 레벨테스트 응답',
    type: [Answer],
  })
  answers: Answer[];
}
