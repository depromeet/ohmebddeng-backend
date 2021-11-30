import { Controller, Get, Post, Body, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
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
import { ERROR_MESSAGE } from '@common/enums/error-message';

@Controller('review')
@ApiTags('리뷰 API')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('food')
  @ApiOperation({summary: '하나의 리뷰를 제출하는 API'})
  async createReview(
    @Body() params: CreateReviewDto,
  ): Promise<CreateReviewResultDto> {
    const { hotLevel, userId, foodId, tags } = params
    if(!hotLevel || !userId || !foodId || !tags){
      throw new HttpException(
        ERROR_MESSAGE.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }
    try{
    return this.reviewService.createReview(hotLevel, userId, foodId, tags);
    } catch(e) {
      throw new HttpException(
        ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Post('foods')
  @ApiOperation({summary: '여러개의 리뷰를 제출하는 API'})
  async createReviews(
    @Body() createReviewsDto: CreateReviewsDto,
  ): Promise<CreateReviewsResultDto> {
    return this.reviewService.createReviews(createReviewsDto);
  }

  @Get('food/:foodId')
  @ApiOperation({summary: '음식 Id 기반 리뷰 조회 API'})
  findReviewByfoodId(@Param() params): Promise<FindReviewDto[]> {
    return this.reviewService.findReviewByfoodId(params.foodId);
  }

  @Get('user/:userId')
  @ApiOperation({summary: '사용자 Id 기반 리뷰 조회 API'})
  findReviewsByUserId(
    @Param() params,
  ): Promise<(Omit<Review, 'hotLevel'> & { hotLevel: HOT_LEVEL })[]> {
    return this.reviewService.findReviewsByUserId(params.userId);
  }

  @Get('food/count/:foodId')
  @ApiOperation({summary: '특정 음식에 대해 사용자 레벨 별로 리뷰 통계를 가져오는 API'})
  findReviewCountByFood(
    @Param() param: { foodId: string },
    @Query() query: { level: '1' | '2' | '3' | '4' | '5' },
  ): Promise<FindReviewCountDto> {
    return this.reviewService.findReviewCountByFood(param.foodId, query.level);
  }
}
