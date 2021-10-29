import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreateReviewsDto } from './dto/create-reviews.dto';
import { FindReviewsQueryDto } from './dto/find-review-query.dto';
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
import {
  FindReviewCountDto,
  TasteTagCountType,
} from './dto/find-review-count.dto';
import { produceTasteTagString } from './utils/produceTasteTag';
import { HOT_LEVEL } from 'src/common/enums/hot-level';
import { TASTE_TAG } from 'src/common/enums/taste-tag';

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

  /*
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
  }*/

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

  async findReviewsByUser(userId: number) {
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

  async findReviewCountByFood(
    foodId: string,
    level: '1' | '2' | '3' | '4' | '5',
  ): Promise<FindReviewCountDto> {
    /**
SELECT 
review.hotLevelId,
    count(*)
FROM
    review
        JOIN
    review_taste_tag ON review.foodId = review_taste_tag.reviewFoodId
        JOIN
    user ON review.userId = user.id
WHERE
    review.foodId = 4 and user.userLevelId = 5
    Group by review.hotLevelId;
 */
    // 주어진 레벨의 유저에 대해, 태그 count하기
    /**
SELECT 
    tasteTagId, COUNT(*)
FROM
    review_taste_tag AS rtt
    join user
    on rtt.reviewUserId = user.id
    where user.userLevelId = 5 and rtt.reviewUserId = 1
GROUP BY rtt.tasteTagId;
 */
    // 주어진 레벨의 유저에 대해, 음식의 맵기 정도 평가 (hotLevelId) count하기
    const hotLevelCount = await this.reviewRepository
      .createQueryBuilder('review')
      .select('review.hotLevelId')
      .addSelect('COUNT(*) AS count')
      .leftJoin('review.tasteReviews', 'tasteTag')
      .leftJoin('review.user', 'user')
      .where('review.foodId = :foodId', { foodId })
      .andWhere('user.userLevelId = :level', { level })
      .groupBy('review.hotLevelId')
      .getRawMany()
      .then((textRows) => {
        const hotLevelCount = {
          [HOT_LEVEL.EASY]: 0,
          [HOT_LEVEL.HOT]: 0,
          [HOT_LEVEL.HOTTEST]: 0,
          [HOT_LEVEL.NORMAL]: 0,
        };

        textRows.forEach((row) => {
          const { hotLevelId, count } = row;
          const tasteTag = produceHotLevelString(hotLevelId);
          hotLevelCount[tasteTag] = Number(count);
        });

        return hotLevelCount;
      });

    const tasteTagCount = await this.reviewRepository
      .createQueryBuilder('review')
      .select('tasteTag.id')
      .addSelect('COUNT(*) AS count')
      .leftJoin('review.tasteReviews', 'tasteTag')
      .leftJoin('review.user', 'user')
      .where('review.foodId = :foodId', { foodId })
      .andWhere('user.userLevelId = :level', { level })
      .groupBy('tasteTag.id')
      .getRawMany()
      .then((textRows) => {
        const tasteTagCount = {
          [TASTE_TAG.ALSSA]: 0,
          [TASTE_TAG.EOLEOL]: 0,
          [TASTE_TAG.EOLKEUN]: 0,
          [TASTE_TAG.GAEUN]: 0,
          [TASTE_TAG.KALKAL]: 0,
          [TASTE_TAG.MAECOMDALCOM]: 0,
        };

        textRows.forEach((row) => {
          const { tasteTag_id: tasteTagId, count } = row;
          const tasteTag = produceTasteTagString(tasteTagId);
          tasteTagCount[tasteTag] = Number(count);
        });

        return tasteTagCount;
      });

    return { hotLevelCount, tasteTagCount };
  }
}
