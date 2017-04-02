/*
 *
 * EntityListForm actions
 *
 */

import {
  SHOW_FILTER_FORM,
} from './constants';

export function showFilterForm(title, options) {
  return {
    type: SHOW_FILTER_FORM,
    title,
    options,
  };
}
