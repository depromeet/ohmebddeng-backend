import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
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
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
  ) {}

 // review: Review[] = [] ;

  async createOneReview(reviewDetails: CreateReviewDto) {

    const {hotlevelId, userId, foodId, TagIds} = reviewDetails;
    const review = new Review();
    review.hotLevel = await getRepository(FoodLevel).findOne(hotlevelId);
    review.user = await getRepository(User).findOne(userId);
    review.food = await getRepository(Food).findOne(foodId);
    /*
    for ( let i = 0; i < TagIds.length ; i++)
    {
      const tag = await getRepository(TasteTag).findOne(TagIds[i]);
      console.log(tag);
      review.tasteReviews[0] = tag;
    }*/
    return this.reviewRepository.save(review);
  }

  findReviewByfoodId(foodId: number) {
    return this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.food', 'food')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.hotLevel', 'hotLevel')
      .leftJoinAndSelect('review.tasteReviews', 'review_taste_tag')
      .where('review.foodId = :foodId', { foodId })
      .getMany();
  }

  findReviewByuserId(userId: number) {
    return this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.food', 'food')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.hotLevel', 'hotLevel')
      .leftJoinAndSelect('review.tasteReviews', 'review_taste_tag')
      .where('review.userId = :userId', { userId })
      .getMany();
  }
}
