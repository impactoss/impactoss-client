/*
 *
 * EntityListForm actions
 *
 */

import {
  SHOW_PANEL,
  SAVE_EDITS,
  RESET_STATE,
  ENTITY_SELECTED,
  ENTITIES_SELECT,
  UPDATE_QUERY,
  UPDATE_GROUP,
  PAGE_CHANGE,
  EXPAND_CHANGE,
  PAGE_ITEM_CHANGE,
  SORTBY_CHANGE,
  SORTORDER_CHANGE,
} from './constants';

export function showPanel(activePanel) {
  return {
    type: SHOW_PANEL,
    activePanel,
  };
}

export function saveEdits(data) {
  return {
    type: SAVE_EDITS,
    data,
  };
}

export function resetState() {
  return {
    type: RESET_STATE,
  };
}

export function selectEntity(data) {
  return {
    type: ENTITY_SELECTED,
    data,
  };
}

export function selectEntities(ids) {
  return {
    type: ENTITIES_SELECT,
    ids,
  };
}

export function updateQuery(value) {
  return {
    type: UPDATE_QUERY,
    value,
  };
}

export function updateGroup(value) {
  return {
    type: UPDATE_GROUP,
    value,
  };
}

export function updatePage(page) {
  return {
    type: PAGE_CHANGE,
    page,
  };
}

export function updatePageItems(no) {
  return {
    type: PAGE_ITEM_CHANGE,
    no,
  };
}

export function updateExpand(expand) {
  return {
    type: EXPAND_CHANGE,
    expand,
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
