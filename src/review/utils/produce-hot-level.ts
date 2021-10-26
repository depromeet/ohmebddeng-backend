import { HOT_LEVEL } from 'src/common/enums/hot-level';

/**
 * hotLevelId를 enum HOT_LEVEL로 변환합니다.
 * @param hotLevelId numberString으로 DB에 저장되는 맵기 레벨 응답값
 */
export const produceHotLevelString = (hotLevelId: string) => {
  switch (hotLevelId) {
    case '1':
      return HOT_LEVEL.EASY;
    case '2':
      return HOT_LEVEL.NORMAL;
    case '3':
      return HOT_LEVEL.HOT;
    case '4':
      return HOT_LEVEL.HOTTEST;
    default:
      return HOT_LEVEL.NEVER_TRIED;
  }
};

/**
 * enum HOT_LEVEL을 DB에 기록할 수 있도록 hotLevelId로 변경합니다.
 * @param hotLevel enum HOT_LEVEL의 값: EASY, NORMAL, HOT, HOTTEST
 */
export const produceHotLevelId = (hotLevel: HOT_LEVEL) => {
  switch (hotLevel) {
    case HOT_LEVEL.EASY:
      return '1';
    case HOT_LEVEL.NORMAL:
      return '2';
    case HOT_LEVEL.HOT:
      return '3';
    case HOT_LEVEL.HOTTEST:
      return '4';
    default:
      return '5';
  }
};
