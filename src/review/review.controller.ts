import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('food')
  async createOneReview(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.createOneReview(createReviewDto);
  }

  @Post('foods')
  async createManyReviews(@Body() createReviewDto: CreateReviewDto) {
    //return this.reviewService.createManyReviews(createReviewDto);
  }

  @Get('food/:foodId')
  findOnebyfood(@Param() params) {
    return this.reviewService.findReviewByfoodId(params.foodId);
  }

  @Get('user/:userId')
  findOnebyuser(@Param() params) {
    return this.reviewService.findReviewByuserId(params.userId);
  }

}
