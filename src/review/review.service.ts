import { CreateReviewDto } from './dto/create-review.dto';
import { CreateReviewsDto } from './dto/create-reviews.dto';
import { Review } from './entities/review.entity';
import { FoodLevel } from '../food/entities/food_level.entity';
import { User } from '../user/entities/user.entity';
import { Food } from '../food/entities/food.entity';
import { TasteTag } from '../review/entities/taste_tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository, getRepository, In } from 'typeorm';
import {
  produceHotLevelId,
  produceHotLevelString,
} from './utils/produce-hot-level';
import {
  FindReviewCountDto,
  HotLevelCountType,
  TasteTagCountType,
} from './dto/find-review-count.dto';
import { produceTasteTagString, produceTasteTagId } from './utils/produceTasteTag';
import { HOT_LEVEL } from 'src/common/enums/hot-level';
import { TASTE_TAG } from 'src/common/enums/taste-tag';
import { ERROR_MESSAGE } from 'src/common/enums/error-message';
import e from 'express';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async createReview(reviewDetails: CreateReviewDto) {
    try{
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
    } catch (e) {
      throw new HttpException(ERROR_MESSAGE.NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
  }

  async createReviews(reviewsDetails: CreateReviewsDto) {
    try{
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
    } catch (e) {
      throw new HttpException(ERROR_MESSAGE.NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
  }

  async findReviewByfoodId(foodId: string) {
    try{
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
    } catch (e) {
      throw new HttpException(ERROR_MESSAGE.NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
  }

  async findReviewsByUserId(userId: string) {
    try{
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
      } catch (e) {
        throw new HttpException(ERROR_MESSAGE.NOT_FOUND, HttpStatus.BAD_REQUEST);
      }
  }

  async findReviewCountByFood(
    foodId: string,
    level: '1' | '2' | '3' | '4' | '5',
  ): Promise<FindReviewCountDto> {
    const totalCount = { totalHotLevelCount: 0, totalTasteTagCount: 0 };
    // 주어진 유저레벨 대해, 음식의 맵기 정도 평가 (hotLevelId) count하기
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
        // SQL에서 COUNT(*)를 하게 되면 존재하는 row만 가져오기 때문에, 미리 객체를 [key]: 0 으로 초기화해 둡니다. (데이터가 없을 경우 0으로 내려주기 위함)
        const hotLevelCount = Object.keys(HOT_LEVEL).reduce((prev, curr) => {
          if (HOT_LEVEL[curr] === HOT_LEVEL.NEVER_TRIED) {
            return prev;
          }
          return { ...prev, [HOT_LEVEL[curr]]: 0 };
        }, {} as HotLevelCountType);

        textRows.forEach((row) => {
          const { hotLevelId, count } = row;
          const tasteTag = produceHotLevelString(hotLevelId);

          // count를 number 형태로 내려줍니다
          hotLevelCount[tasteTag] = Number(count);
          totalCount.totalHotLevelCount += Number(count);
        });

        return hotLevelCount;
      });

    // 주어진 유저레벨 대해, 음식의 맛 태그 평가 (hotLevelId) count하기
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
        // SQL에서 COUNT(*)를 하게 되면 존재하는 row만 가져오기 때문에, 미리 객체를 [key]: 0 으로 초기화해 둡니다. (데이터가 없을 경우 0으로 내려주기 위함)
        const tasteTagCount = Object.keys(TASTE_TAG).reduce((prev, curr) => {
          return { ...prev, [TASTE_TAG[curr]]: 0 };
        }, {} as TasteTagCountType);

        textRows.forEach((row) => {
          const { tasteTag_id: tasteTagId, count } = row;
          const tasteTag = produceTasteTagString(tasteTagId);

          // count를 number 형태로 내려줍니다
          tasteTagCount[tasteTag] = Number(count);
          totalCount.totalTasteTagCount += Number(count);
        });

        return tasteTagCount;
      });

    return {
      hotLevelCount,
      tasteTagCount,
      ...totalCount,
    };
  }
}
