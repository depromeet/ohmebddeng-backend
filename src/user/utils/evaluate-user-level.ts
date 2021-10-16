import { CreateReviewDto } from 'src/review/dto/create-review.dto';
import { UserLevel } from '../entities/user_level.entity';

export const evaluateUserLevel = (params: CreateReviewDto): UserLevel => {
  return;
};

interface ILevelTestParam {
  foodLevelId: string;
  hotLevelId: string;
}

export class EvaluateUserLevel {
  private level: string;
  private score: number = 0;
  private reviewList = [];

  constructor(reviewList: any[]) {
    this.reviewList = reviewList;
  }

  // 점수를 계산하라
  private calculateScore(params: ILevelTestParam[]) {
    params.forEach(({ foodLevelId, hotLevelId }) => {
      this.score += Number(foodLevelId) * (5 - Number(hotLevelId));
    });
  }

  // 레벨을 결정하라
  private classifyUserLevel(score: number) {
    if (score <= 48) {
      //calc
    } else if (score <= 66) {
      //calc
    } else if (score <= 84) {
      //calc
    } else if (score <= 102) {
      //calc
    } else {
      //calc
    }
  }

  // 레벨을 제공하라
  public evaluateLevel(params: ILevelTestParam[]): string {
    this.calculateScore(params);
    this.classifyUserLevel(this.score);
    return this.level;
  }
}
