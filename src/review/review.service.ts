import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity'
<<<<<<< HEAD
import { FoodLevel } from '../food/entities/food_level.entity'
import { User } from '../user/entities/user.entity'
import { Food } from '../food/entities/food.entity'
import { TasteTag } from '../review/entities/taste_tag.entity'
=======
>>>>>>> 498d0511ec91a30b67a7a2508abacaabd062adbf
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';

@Injectable()
export class ReviewService {
  constructor(
<<<<<<< HEAD
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async createOneReview(reviewDetails: CreateReviewDto) {

    const {hotLevelId, userId, foodId, TagIds} = reviewDetails;
    const review = new Review();
    review.hotLevel = await getRepository(FoodLevel).findOne(hotLevelId);
    review.user = await getRepository(User).findOne(userId);
    review.food = await getRepository(Food).findOne(foodId);
    review.tasteReviews = [new TasteTag()]; 
    
    for ( let i = 0; i < TagIds.length ; i++)
    {
      const tag = await getRepository(TasteTag).findOne(TagIds[i]);
      review.tasteReviews[i] = tag;
    }

    const result = await this.reviewRepository.save(review)

    return result ;
  }

  findReviewByfoodId(foodId: number) {
    return this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.food', 'food')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.hotLevel', 'hotLevel')
      .leftJoinAndSelect('review.tasteReviews', 'review_taste_tag')
=======
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
  ) {
    this.reviewRepository = reviewRepository;
  }

  review: Review[] = [] ;

  createOneReview(createReviewDto: CreateReviewDto) {
    //return this.reviewRepository.save(createReviewDto);
  }

  findReviewByfoodId(foodId: number) {

    return this.reviewRepository
      .createQueryBuilder('review')
      .leftJoin('review.food', 'food')
      .leftJoin('review.user', 'user')
      .leftJoin('review.hotLevel', 'hotLevel')
      .leftJoin('review.tasteReviews', 'review_taste_tag')
      .select(['review','food.id', 'food.name', 'user.id', 'hotLevel', 'review_taste_tag.id', 'review_taste_tag.name'])
>>>>>>> 498d0511ec91a30b67a7a2508abacaabd062adbf
      .where('review.foodId = :foodId', { foodId })
      .getMany();
  }

<<<<<<< HEAD
  findReviewByuserId(userId: number) {
=======
  findReviewByUserId(userId: number) {
>>>>>>> 498d0511ec91a30b67a7a2508abacaabd062adbf
    return this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.food', 'food')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.hotLevel', 'hotLevel')
      .leftJoinAndSelect('review.tasteReviews', 'review_taste_tag')
<<<<<<< HEAD
=======
      .select(['review','food.id', 'food.name', 'user.id', 'hotLevel', 'review_taste_tag.id', 'review_taste_tag.name'])
>>>>>>> 498d0511ec91a30b67a7a2508abacaabd062adbf
      .where('review.userId = :userId', { userId })
      .getMany();
  }
}
