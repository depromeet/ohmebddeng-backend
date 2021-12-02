import { Controller, Get, Post, Body, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { Review } from './entities/review.entity';
import { ReviewService } from './review.service';
import { FoodLevel } from '../food/entities/food_level.entity';
import { User } from '../user/entities/user.entity';
import { Food } from '../food/entities/food.entity';
import { TasteTag } from '../review/entities/taste_tag.entity';
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
import { produceTasteTagString, produceTasteTagId } from './utils/produceTasteTag';
import { produceHotLevelId, produceHotLevelString} from './utils/produce-hot-level';
import { Repository, getRepository, In } from 'typeorm';

@Controller('review')
@ApiTags('리뷰 API')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  @Post('food')
  @ApiOperation({summary: '하나의 리뷰를 제출하는 API'})
  async createReview(
    @Body() params: CreateReviewDto,
  ): Promise<CreateReviewResultDto> {
    try{
    const { hotLevel, userId, foodId, tags } = params
    // request 값이 잘못 되었을 때 404에러를 throw 합니다.
    if(!hotLevel || !userId || !foodId || !tags){
      throw new HttpException(
        ERROR_MESSAGE.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }
      const hotLevelId = produceHotLevelId(hotLevel);
      const hotLevelname = await getRepository(FoodLevel).findOne(hotLevelId);
      const user = await getRepository(User).findOne(userId);
      const food = await getRepository(Food).findOne(foodId);
      const tasteReviews = await getRepository(TasteTag).find({
        name: In(tags),
      });
      // 존재하지 않는 정보에 접근했을 때 notFound error를 throw합니다.
      if(!hotLevelname || !user || !food || !tasteReviews){
        throw new HttpException(
          ERROR_MESSAGE.NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      return this.reviewService.createReview(user, food, tasteReviews, hotLevelname);
    } catch(e) {
      if (e.status == HttpStatus.NOT_FOUND || e.status == HttpStatus.BAD_REQUEST)
        throw e
      else{
        throw new HttpException(
          ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      }
    }
  }

  @Post('foods')
  @ApiOperation({summary: '여러개의 리뷰를 제출하는 API'})
  async createReviews(
    @Body() params: CreateReviewsDto,
  ): Promise<CreateReviewsResultDto> {
    try{
      const { userId, reviewList } = params;

      if(!userId || !reviewList){
        throw new HttpException(
          ERROR_MESSAGE.BAD_REQUEST,
          HttpStatus.BAD_REQUEST,
        );
      }
      const user = await getRepository(User).findOne(userId);
      const reviews = await Promise.all(reviewList.map(async ({ foodId, hotLevel, tags }) => {
        const review = new Review();
        const hotLevelId = produceHotLevelId(hotLevel);
        review.user = user
        review.food = await getRepository(Food).findOne(foodId);
        review.hotLevel = await getRepository(FoodLevel).findOne(hotLevelId);
        review.tasteReviews = await getRepository(TasteTag).find({
         name: In(tags),
        });
        if (!review.user || !review.food || !review.hotLevel || !review.tasteReviews){
          throw new HttpException(
            ERROR_MESSAGE.NOT_FOUND,
            HttpStatus.NOT_FOUND,
          );
        }
        return review
      }));
      return this.reviewService.createReviews(user, reviews);
    } catch(e) {
      if (e.status == HttpStatus.NOT_FOUND || e.status == HttpStatus.BAD_REQUEST)
        throw e
      else{
        throw new HttpException(
          ERROR_MESSAGE.INTERNAL_SERVER_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      }
    }
  }

  @Get('food/:foodId')
  @ApiOperation({summary: '음식 Id 기반 리뷰 조회 API'})
  async findReviewByfoodId(@Param() params): Promise<FindReviewDto[]> {
    try{
      const reviews = await this.reviewService.findReviewByfoodId(params.foodId);
      const food = await getRepository(Food).findOne(params.foodId);
      
      if(!food){
        throw new HttpException(
          ERROR_MESSAGE.NOT_FOUND,
          HttpStatus.NOT_FOUND
        )
      }
      const result = Promise.all(reviews.map((review) => {
        const hotLevel = produceHotLevelString(review.hotLevel.id);
        return { ...review, hotLevel };
      }),)

    return result
    } catch(e) {
        throw e
    }
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
