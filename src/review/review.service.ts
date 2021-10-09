import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
      .leftJoinAndSelect('review.food', 'food')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.hotLevel', 'hotLevel')
      .where('review.foodId = :foodId', { foodId })
      .getOne();
  }

  findReviewByuserId(userId: number) {
    return this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.food', 'food')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.hotLevel', 'hotLevel')
      .where('review.userId = :userId', { userId })
  }
}
