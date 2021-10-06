import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Food } from './entities/food.entity';

@Injectable()
export class FoodService {
  constructor(
    @InjectRepository(Food)
    private readonly foodRepository: Repository<Food>,
  ) {
    this.foodRepository = foodRepository;
  }

  async findReviewFoods(): Promise<Food[]> {
    const foodList = await this.foodRepository.find();
    return foodList;
  }

  async findTestFoods(): Promise<Food[]> {
    return await this.foodRepository.find();
  }
}
