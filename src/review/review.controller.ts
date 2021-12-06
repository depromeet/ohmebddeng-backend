import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Review } from './entities/review.entity';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreateReviewsDto } from './dto/create-reviews.dto';
import { CreateReviewResultDto } from './dto/create-review-result.dto';
import { CreateReviewsResultDto } from './dto/create-reviews-result.dto';
import { FindReviewDto } from './dto/find-review.dto';
import {
  ApiBody,
  ApiResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiQuery,
  OmitType,
} from '@nestjs/swagger';
import { HOT_LEVEL } from 'src/common/enums/hot-level';
import { FindReviewCountDto } from './dto/find-review-count.dto';
import { CreateFoodRequestDto } from './dto/create-food-request.dto';
import { ERROR_MESSAGE } from '@common/enums/error-message';

@Controller('review')
@ApiTags('리뷰 API')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('food')
  @ApiOperation({
    summary: '하나의 리뷰를 제출하는 API',
    description: '하나의 리뷰에 대한 정보를 받아 저장한다.',
  })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({
    description:
      '성공적으로 리뷰가 저장되었을 경우 userId와 foodId정보를 돌려준다.',
    type: CreateReviewResultDto,
  })
  async createReview(
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<CreateReviewResultDto> {
    return this.reviewService.createReview(createReviewDto);
  }

  @Post('foods')
  @ApiOperation({
    summary: '여러개의 리뷰를 제출하는 API',
    description: '여러개의 리뷰에 대한 정보를 받아 저장한다.',
  })
  @ApiBody({ type: CreateReviewsDto })
  @ApiResponse({
    description:
      '성공적으로 리뷰들이 저장되었을 경우 저장된 리뷰의 개수, 유저Id를 돌려준다.',
    type: CreateReviewsResultDto,
  })
  async createReviews(
    @Body() createReviewsDto: CreateReviewsDto,
  ): Promise<CreateReviewsResultDto> {
    return this.reviewService.createReviews(createReviewsDto);
  }

  @Post('food/request')
  @ApiOperation({ summary: '사용자가 음식 추가 요청을 하는 API' })
  async createFoodRequest(@Body() param: CreateFoodRequestDto): Promise<void> {
    const { food } = param;
    try {
      await this.reviewService.createFoodRequest(food);
      return;
    } catch (e) {
      throw new HttpException(
        ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('food/:foodId')
  @ApiOperation({
    summary: '음식 Id 기반 리뷰 조회 API',
    description: '음식 ID를 기반으로 리뷰를 찾아 반환한다',
  })
  @ApiParam({ name: '음식 id', type: String })
  @ApiResponse({
    description: '해당하는 리뷰에 대한 정보를 받는다.',
    type: FindReviewDto,
  })
  findReviewByfoodId(@Param() params): Promise<FindReviewDto[]> {
    return this.reviewService.findReviewByfoodId(params.foodId);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: '사용자 Id 기반 리뷰 조회 API',
    description: '사용자 ID를 기반으로 리뷰를 찾아 반환한다',
  })
  @ApiParam({ name: '사용자ID', type: String })
  @ApiResponse({
    description: '해당하는 리뷰에 대한 정보를 받는다.',
    type: [OmitType(Review, [])],
  })
  findReviewsByUserId(
    @Param() params,
  ): Promise<(Omit<Review, 'hotLevel'> & { hotLevel: HOT_LEVEL })[]> {
    return this.reviewService.findReviewsByUserId(params.userId);
  }

  @Get('food/count/:foodId')
  @ApiOperation({
    summary: '특정 음식에 대해 사용자 레벨 별로 리뷰 통계를 가져오는 API',
    description:
      '특정 음식에 대해 조회하려는 사용자레벨 별로 매운 정도 통계, 태그 통계를 가져온다',
  })
  @ApiParam({ name: '가져오려는 음식의 id', type: String })
  @ApiQuery({
    name: '데이터를 가져오려는 사용자 레벨',
    type: '1' || '2' || '3' || '4' || '5',
  })
  @ApiResponse({
    description:
      '해당 음식에 대한 사용자들의 매운 정도 평가, 맛 평가 태그 count 값',
    type: FindReviewCountDto,
  })
  findReviewCountByFood(
    @Param() param: { foodId: string },
    @Query() query: { level: '1' | '2' | '3' | '4' | '5' },
  ): Promise<FindReviewCountDto> {
    return this.reviewService.findReviewCountByFood(param.foodId, query.level);
  }
}
