import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import { HOT_LEVEL } from 'src/common/enums/hot-level';
import { UserLevel } from '../entities/user_level.entity';
import { ReviewDto } from 'src/review/dto/create-reviews.dto';

/**
 * 아래 interface는 임시로 사용합니다. 혜연님 담당부분인 IReview가 수정되면 IReview를 사용할 예정입니다.
 * 혜연님 담당의 IReview의 경우, 다른 controller/service와 연결된 부분이 많아 별도의 작업으로 수정이 필요하여, 지금 PR에서 진행하진 않으려 합니다.
 * 지금은 임시로 아래 선언하는 임시 interface를 사용하고, IReview 리팩토링시 IReview로 대체할 예정입니다:)
 */

export class TemporaryAnswer {
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
    type: [TemporaryAnswer],
  })
  answers: Pick<ReviewDto, 'foodId' | 'hotLevel'>[];
  // answers: TemporaryAnswer[];
}
