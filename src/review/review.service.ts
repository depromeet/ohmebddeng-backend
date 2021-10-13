import { Injectable, Body, Controller, Delete, Get, Param, Post, Res } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { CreateManyReviewDto } from './dto/create-many-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity'
import { FoodLevel } from '../food/entities/food_level.entity'
import { User } from '../user/entities/user.entity'
import { Food } from '../food/entities/food.entity'
import { TasteTag } from '../review/entities/taste_tag.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async createOneReview(reviewDetails: CreateReviewDto) {

    const {hotLevelId, userId, foodId, tagIds} = reviewDetails;
    const review = new Review();
    review.hotLevel = await getRepository(FoodLevel).findOne(hotLevelId);
    review.user = await getRepository(User).findOne(userId);
    review.food = await getRepository(Food).findOne(foodId);
    review.tasteReviews = [new TasteTag()]; 
    
    for ( let i = 0; i < tagIds.length ; i++)
    {
      const tag = await getRepository(TasteTag).findOne(tagIds[i]);
      review.tasteReviews[i] = tag;
    }

    const result = await this.reviewRepository.save(review)
    
    return await Object.assign({
      userId: result.user.id,
      foodId: result.food.id,
    });
  }

  async createManyReviews(reviewListDetails: CreateManyReviewDto) {

    const { userId, reviewList } = reviewListDetails;
    const review = new Review();
    review.user = await getRepository(User).findOne(userId);
    
    for ( let i = 0; i < reviewList.length; i++){
      review.hotLevel = await getRepository(FoodLevel).findOne(reviewList[i].hotLevelId);
      review.food = await getRepository(Food).findOne(reviewList[i].foodId);
      review.tasteReviews= [new TasteTag()]; 

      for ( let j = 0; j < reviewList[i].tagIds.length ; j++)
      {
        const tag = await getRepository(TasteTag).findOne(reviewList[j].tagIds.length);
        review.tasteReviews[j] = tag;
      }
    }
    return await Object.assign({
      userId: review.user.id,
      reviewLength: reviewList.length,
    });
  }

  findReviewByfoodId(foodId: number) {

    return this.reviewRepository
      .createQueryBuilder('review')
      .leftJoin('review.food', 'food')
      .leftJoin('review.user', 'user')
      .leftJoin('review.hotLevel', 'hotLevel')
      .leftJoin('review.tasteReviews', 'review_taste_tag')
      .select(['review','food.id', 'food.name', 'user.id', 'hotLevel', 'review_taste_tag.id', 'review_taste_tag.name'])
      .where('review.foodId = :foodId', { foodId })
      .getMany();
  }

  findReviewByUserId(userId: number) {
        return this.reviewRepository
          .createQueryBuilder('review')
          .leftJoinAndSelect('review.food', 'food')
          .leftJoinAndSelect('review.user', 'user')
          .leftJoinAndSelect('review.hotLevel', 'hotLevel')
          .leftJoinAndSelect('review.tasteReviews', 'review_taste_tag')
          .select(['review','food.id', 'food.name', 'user.id', 'hotLevel', 'review_taste_tag.id', 'review_taste_tag.name'])
          .where('review.userId = :userId', { userId })
          .getMany();
      }
    }
