import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';

@Injectable()
export class ReviewService {
  constructor(
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
