/*
 *
 * EntityListForm actions
 *
 */

import {
  SHOW_FILTER_FORM,
  HIDE_FILTER_FORM,
  SHOW_EDIT_FORM,
  HIDE_EDIT_FORM,
  SHOW_PANEL,
} from './constants';

export function showFilterForm(option) {
  return {
    type: SHOW_FILTER_FORM,
    option,
  };
}

export function hideFilterForm() {
  return {
    type: HIDE_FILTER_FORM,
  };
}

export function showEditForm(option) {
  return {
    type: SHOW_EDIT_FORM,
    option,
  };
}

export function hideEditForm() {
  return {
    type: HIDE_EDIT_FORM,
  };
}

export function showPanel(activePanel) {
  return {
    type: SHOW_PANEL,
    activePanel,
  };
}
