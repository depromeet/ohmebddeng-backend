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

  create(createReviewDto: CreateReviewDto) {
    //this.review.push(createReviewDto);
  }

  findReviewByfoodId(foodId: number) {
    return this.reviewRepository
      .createQueryBuilder('review')
      .where('review.foodId = :foodId', { foodId })
      .getOne();
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
