/*
 *
 * ActionList actions
 *
 */

import {
  SET_SORT,
} from './constants';

export function setSort(sort, order) {
  return {
    type: SET_SORT,
    sort,
    order,
  };
}
