import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreateReviewsDto } from './dto/create-reviews.dto';
import { Review } from './entities/review.entity';
import { FoodLevel } from '../food/entities/food_level.entity';
import { User } from '../user/entities/user.entity';
import { Food } from '../food/entities/food.entity';
import { TasteTag } from '../review/entities/taste_tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import {
  produceHotLevelId,
  produceHotLevelString,
} from './utils/produce-hot-level';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async createReview(reviewDetails: CreateReviewDto) {
    const { hotLevel, userId, foodId, tagIds } = reviewDetails;
    const review = new Review();
    const hotLevelId = produceHotLevelId(hotLevel);

    review.hotLevel = await getRepository(FoodLevel).findOne(hotLevelId);
    review.user = await getRepository(User).findOne(userId);
    review.food = await getRepository(Food).findOne(foodId);
    review.tasteReviews = await Promise.all(
      tagIds.map(async (tagid) => {
        const tag = getRepository(TasteTag).findOne(tagid);
        return tag;
      }),
    );

    const result = await this.reviewRepository.save(review);

    return {
      userId: result.user.id,
      foodId: result.food.id,
    };
  }

  async createReviews(reviewsDetails: CreateReviewsDto) {
    const { userId, reviewList } = reviewsDetails;

    reviewList.map(async ({ foodId, hotLevel, tagIds }) => {
      const review = new Review();
      const hotLevelId = produceHotLevelId(hotLevel);

      review.user = await getRepository(User).findOne(userId);
      review.food = await getRepository(Food).findOne(foodId);
      review.hotLevel = await getRepository(FoodLevel).findOne(hotLevelId);
      review.tasteReviews = await Promise.all(
        tagIds.map(async (tagid) => {
          const tag = getRepository(TasteTag).findOne(tagid);
          return tag;
        }),
      );
      return this.reviewRepository.save(review);
    });

    return {
      userId: userId,
      reviewLength: reviewList.length,
    };
  }

  async findReviewByfoodId(foodId: number) {
    return this.reviewRepository
      .createQueryBuilder('review')
      .leftJoin('review.food', 'food')
      .leftJoin('review.user', 'user')
      .leftJoin('review.hotLevel', 'hotLevel')
      .leftJoin('review.tasteReviews', 'review_taste_tag')
      .select([
        'review',
        'food.id',
        'food.name',
        'user.id',
        'hotLevel',
        'review_taste_tag.id',
        'review_taste_tag.name',
      ])
      .where('review.foodId = :foodId', { foodId })
      .getMany()
      .then((reviews) =>
        reviews.map((review) => {
          const hotLevel = produceHotLevelString(review.hotLevel.id);
          return { ...review, hotLevel };
        }),
      );
  }

  async findReviewByUserId(userId: number) {
    return this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.food', 'food')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.hotLevel', 'hotLevel')
      .leftJoinAndSelect('review.tasteReviews', 'review_taste_tag')
      .select([
        'review',
        'food.id',
        'food.name',
        'user.id',
        'hotLevel',
        'review_taste_tag.id',
        'review_taste_tag.name',
      ])
      .where('review.userId = :userId', { userId })
      .getMany()
      .then((reviews) =>
        reviews.map((review) => {
          const hotLevel = produceHotLevelString(review.hotLevel.id);
          return { ...review, hotLevel };
        }),
      );
  }
}
