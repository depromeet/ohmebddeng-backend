import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreateReviewsDto } from './dto/create-reviews.dto'
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('food')
  async createReview(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.createReview(createReviewDto);
  }

  @Post('foods')
  async createReviews(@Body() createReviewsDto: CreateReviewsDto) {
    return this.reviewService.createReviews(createReviewsDto);
  }

  @Get('food/:foodId')
  findOnebyfood(@Param() params) {
    return this.reviewService.findReviewByfoodId(params.foodId);
  }

  @Get('user/:userId')
  findOnebyuser(@Param() params) {
    return this.reviewService.findReviewByUserId(params.userId);
  }

}
