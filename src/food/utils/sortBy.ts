import { SORT } from 'src/common/enums/sort';
import { SelectQueryBuilder } from 'typeorm';
import { Food } from '../entities/food.entity';

/**
 *
 * @param query queryBuilder로 만든 query: SelectQueryBuilder<Food>
 * @param sort enum SORT: ASC, DESC, RANDOM
 * @returns 체인 형태로 연결할 수 있는 SelectQueryBuilder<Food>
 */
export const sortBy = (query: SelectQueryBuilder<Food>, sort: SORT) => {
  switch (sort) {
    case SORT.DESC:
      return query.orderBy('food.id', 'DESC');
    case SORT.RAND:
      return query.orderBy('RAND()');
    default:
      // SORT.DESC
      return query;
  }
};
