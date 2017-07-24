/*
 *
 * CategoryList actions
 *
 */

import {
  SORT_CHANGE,
} from './constants';

export function updateSort({ sort, order }) {
  // console.log('updateSort action')
  return {
    type: SORT_CHANGE,
    sort,
    order,
  };
}
