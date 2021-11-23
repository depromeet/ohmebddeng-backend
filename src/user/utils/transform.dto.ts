import { Food } from '@food/entities/food.entity';
import { Answer } from '@user/dto/create-user-level.dto';

export class TransformDto {
  findUser() {}

  updateUserLevel(foods: Food[], answers: Answer[]) {
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

    return createEvaluateUserLevelParam(foods, answers);
  }

  findUserCount() {}
}
