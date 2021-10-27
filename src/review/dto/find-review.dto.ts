import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsString, IsDate, IsBoolean } from 'class-validator';
import { HOT_LEVEL } from 'src/common/enums/hot-level';
import { TasteTag } from '../entities/taste_tag.entity';
import { Food } from 'src/food/entities/food.entity';
import { User } from 'src/user/entities/user.entity';
import { Review } from '../entities/review.entity';

@ApiExtraModels(TasteTag, Review)
export class FindReviewDto {
  @IsEnum(HOT_LEVEL)
  @ApiProperty({
    description:
      "음식 레벨 ex) 'EASY', 'NORMAL', 'HOT', 'HOTTEST', 'NEVER_TRIED'",
  })
  hotLevel: HOT_LEVEL;
  @IsString()
  @ApiProperty({ description: '리뷰에 포함된 이미지의 url' })
  imageUrl: string;
  @IsDate()
  @ApiProperty({ description: '리뷰가 생성된 날짜' })
  createdAt: Date;
  @IsDate()
  @ApiProperty({ description: '리뷰가 수정된 날짜' })
  updatedAt: Date;
  @IsDate()
  @ApiProperty({ description: '리뷰가 삭제된 날짜' })
  deletedAt: Date;
  @IsBoolean()
  @ApiProperty({ description: '삭제된 리뷰인지 여부' })
  isDeleted: boolean;
  @IsArray()
  @ApiProperty({ description: '리뷰의 맛평가 태그 배열' })
  tasteReviews: TasteTag[];
  @IsArray()
  @ApiProperty({ description: '리뷰대상 음식 정보' })
  food: Food;
  @IsArray()
  @ApiProperty({ description: '리뷰를 작성한 유저 정보' })
  user: User;
}
