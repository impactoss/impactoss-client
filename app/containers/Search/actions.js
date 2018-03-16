/*
 *
 * Search actions
 *
 */

import {
  UPDATE_QUERY,
  RESET_SEARCH_QUERY,
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
