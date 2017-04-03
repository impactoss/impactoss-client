/*
 *
 * EntityListForm actions
 *
 */

import {
  SHOW_FILTER_FORM,
  HIDE_FILTER_FORM,
} from './constants';

export function showFilterForm(title, optionsPath) {
  return {
    type: SHOW_FILTER_FORM,
    title,
    optionsPath,
  };
}

export function hideFilterForm() {
  return {
    type: HIDE_FILTER_FORM,
  };
}
