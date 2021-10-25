import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Review } from './entities/review.entity'
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreateReviewsDto } from './dto/create-reviews.dto'
import { CreateReviewResultDto } from './dto/create-review-result.dto'
import { CreateReviewsResultDto } from './dto/create-reviews-result.dto'
import {
  ApiBody,
  ApiResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

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
    description: '성공적으로 리뷰가 저장되었을 경우 userId와 foodId정보를 돌려준다.',
    type : CreateReviewResultDto
  })
  async createReview(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.createReview(createReviewDto);
  }

  @Post('foods')
  @ApiOperation({
    summary: '여러개의 리뷰를 제출하는 API',
    description: '여러개의 리뷰에 대한 정보를 받아 저장한다.',
  })
  @ApiBody({ type: CreateReviewsDto })
  @ApiResponse({ 
    description: '성공적으로 리뷰들이 저장되었을 경우 저장된 리뷰의 개수, 유저Id를 돌려준다.',
    type: CreateReviewsResultDto
  })
  async createReviews(@Body() createReviewsDto: CreateReviewsDto) {
    return this.reviewService.createReviews(createReviewsDto);
  }

  @Get('food/:foodId')
  @ApiOperation({
    summary: '음식 Id 기반 리뷰 조회 API',
    description: '음식 ID를 기반으로 리뷰를 찾아 반환한다',
  })
  @ApiParam({ name: '음식ID', type: String })
  @ApiResponse({ description: '해당하는 리뷰에 대한 정보를 받는다.'})
  findOnebyfood(@Param() params) {
    return this.reviewService.findReviewByfoodId(params.foodId);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: '사용자 Id 기반 리뷰 조회 API',
    description: '사용자 ID를 기반으로 리뷰를 찾아 반환한다',
  })
  @ApiParam({ name: '사용자ID', type: String })
  @ApiResponse({ description: '해당하는 리뷰에 대한 정보를 받는다.'})
  findOnebyuser(@Param() params) {
    return this.reviewService.findReviewByUserId(params.userId);
  }

}
