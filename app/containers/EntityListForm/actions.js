/*
 *
 * EntityListForm actions
 *
 */
import { SET_FILTER } from './constants';

export function setFilter(values) {
  return {
    type: SET_FILTER,
    values,
  };
}
