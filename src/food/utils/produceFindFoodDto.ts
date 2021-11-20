import { produceHotLevelString } from 'src/review/utils/produce-hot-level';
import { FindFoodDto } from '../dto/find-food.dto';
import { Food } from '../entities/food.entity';

/**
 * Food 배열을 받아 FindFoodDto 배열을 반환하는 함수. DB에서 가져온 데이터를 클라이언트에서 쓰기 쉽게 가공하는 역할을 함.
 * @param foods Food entity 배열
 * @returns id: 음식id, name: 음식명, subName: 음식 맛, imageUrl: 음식 이미지, logoImageUrl: 음식 로고 이미지, hotLevel: 음식 맵기 레벨 객체로 이루어진 배열
 */
export const produceFindFoodDto = (foods: Food[]): FindFoodDto[] => {
  return foods.map(
    ({ id, name, subName, imageUrl, logoImageUrl, foodLevel }) => {
      const hotLevel = produceHotLevelString(foodLevel ? foodLevel.id : '1');

      return { id, name, subName, imageUrl, logoImageUrl, hotLevel };
    },
  );
};
