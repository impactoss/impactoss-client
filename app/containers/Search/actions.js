/*
 *
 * Search actions
 *
 */

import {
  UPDATE_QUERY,
  RESET_SEARCH_QUERY,
  SORTBY_CHANGE,
  SORTORDER_CHANGE,
} from './constants';

export function updateQuery(value) {
  return {
    type: UPDATE_QUERY,
    value,
  };
}

export function resetSearchQuery(values) {
  return {
    type: RESET_SEARCH_QUERY,
    values,
  };
}

export function updateSortBy(sort) {
  return {
    type: SORTBY_CHANGE,
    sort,
  };
}

export function updateSortOrder(order) {
  return {
    type: SORTORDER_CHANGE,
    order,
  };
}
