/*
 *
 * EntityListForm actions
 *
 */

import {
  SHOW_FILTER_FORM,
} from './constants';

export function showFilterForm(option, group) {
  return {
    type: SHOW_FILTER_FORM,
    option,
    group,
  };
}
