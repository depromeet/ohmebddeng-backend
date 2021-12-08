import { Food } from '@food/entities/food.entity';
import { Answer } from '@user/dto/create-user-level.dto';
import { HOT_LEVEL } from 'src/common/enums/hot-level';

interface ILevelTest {
  foodLevelId: string;
  hotLevel: HOT_LEVEL;
}

export class EvaluateUserLevel {
  private level: number;
  private score: number = 0;
  private answers: ILevelTest[];

  // 필요한 데이터를 조합하라
  transformEvaluateParam(foods: Food[], answers: Answer[]) {
    /**
     * EvaluateLevel에 필요한 형태로 foods와 answers 두 배열을 가공합니다.
     * foods와 answers 두 배열을 합칩니다. 동일한 foodId를 기준으로 두 배열의 각 요소는 합쳐지게 됩니다. foodId는 제외합니다.
     * @param foods foodId와 foodLeveLid로 이뤄진 배열
     * @param answers foodId와 HOT_LEVEL로 이뤄진 배열
     * @returns foods와 answers를 겹치는 foodId를 기준으로 요소를 합친 배열 { foodLevelId, hotLevelId }
     */
    const createEvaluateUserLevelParam = (foods: Food[], answers: Answer[]) => {
      return foods.map((food) => {
        const { foodLevel, id: foodId } = food;
        // answers에서 food와 foodId가 같은 요소를 탐색
        const { hotLevel } = answers.find((answer) => answer.foodId === foodId);

        // 응답(answer)에 일치하는 foodId가 있는 경우만 hotLevel과 foodLevelId를 반환되는 배열에 추가
        return hotLevel && { hotLevel, foodLevelId: foodLevel.id };
      });
    };

    this.answers = createEvaluateUserLevelParam(foods, answers);
  }

  // 점수를 계산하라
  private calculateScore(): void {
    const scoreByLevel = [0, 0, 0, 0, 0];
    const countByLevel = [0, 0, 0, 0, 0];

    this.answers.forEach(({ foodLevelId, hotLevel }) => {
      let foodLevelNumberId = 0;
      const foodLevelRegex = /^[1-4]{1}$/; // 1 ~ 4까지의 string만 허용: "1", "2", "3", "4"

      if (foodLevelId.match(foodLevelRegex)) {
        foodLevelNumberId = Number(foodLevelId);
      }
      switch (hotLevel) {
        case HOT_LEVEL.EASY:
          scoreByLevel[foodLevelNumberId] += foodLevelNumberId * 4;
          countByLevel[foodLevelNumberId] += 1;
          break;
        case HOT_LEVEL.NORMAL:
          scoreByLevel[foodLevelNumberId] += foodLevelNumberId * 3;
          countByLevel[foodLevelNumberId] += 1;
          break;
        case HOT_LEVEL.HOT:
          scoreByLevel[foodLevelNumberId] += foodLevelNumberId * 2;
          countByLevel[foodLevelNumberId] += 1;
          break;
        case HOT_LEVEL.HOTTEST:
          scoreByLevel[foodLevelNumberId] += foodLevelNumberId * 1;
          countByLevel[foodLevelNumberId] += 1;
          break;
        default:
          // HOT_LEVEL.NEVER_TRIED의 경우, 기본점수로 중간값 2.5를 배정
          scoreByLevel[foodLevelNumberId] += foodLevelNumberId * 2.5;
          countByLevel[foodLevelNumberId] += 1;
          break;
      }
    });

    this.score = scoreByLevel.reduce((acc, cur, idx) => {
      if (countByLevel[idx] === 0) return 0; // padding은 계산하지 않음

      return (acc += cur / countByLevel[idx]); // 해당 레벨의 총점을 문항수로 나눈 평균값을 score에 더함
    }, 0);
  }

  // 레벨을 결정하라
  private classifyUserLevel(): void {
    if (this.score <= 16) {
      this.level = 1;
    } else if (this.score <= 22) {
      this.level = 2;
    } else if (this.score <= 28) {
      this.level = 3;
    } else if (this.score <= 34) {
      this.level = 4;
    } else {
      this.level = 5;
    }
  }

  // 레벨을 제공하라
  public evaluateLevel(foods: Food[], answers: Answer[]): number {
    this.transformEvaluateParam(foods, answers);
    this.calculateScore();
    this.classifyUserLevel();
    return this.level;
  }
}
