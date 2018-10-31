/*
 *
 * EntityListForm actions
 *
 */

import {
  SHOW_PANEL,
  SAVE,
  NEW_CONNECTION,
  DELETE_CONNECTION,
  RESET_STATE,
  RESET_PROGRESS,
  ENTITY_SELECTED,
  ENTITIES_SELECT,
  UPDATE_QUERY,
  UPDATE_GROUP,
  PAGE_CHANGE,
  EXPAND_CHANGE,
  PAGE_ITEM_CHANGE,
  SORTBY_CHANGE,
  SORTORDER_CHANGE,
  PATH_CHANGE,
  DISMISS_ERROR,
  RESET_SEARCH_QUERY,
} from './constants';

export function setClientPath(path) {
  return {
    type: PATH_CHANGE,
    path,
  };
}
export function showPanel(activePanel) {
  return {
    type: SHOW_PANEL,
    activePanel,
  };
}

export function save(data) {
  return {
    type: SAVE,
    data,
  };
}
export function newConnection(data) {
  return {
    type: NEW_CONNECTION,
    data,
  };
}
export function deleteConnection(data) {
  return {
    type: DELETE_CONNECTION,
    data,
  };
}

export function resetState(path) {
  return {
    type: RESET_STATE,
    path,
  };
}

export function resetProgress() {
  return {
    type: RESET_PROGRESS,
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

export function resetSearchQuery(values) {
  return {
    type: RESET_SEARCH_QUERY,
    values,
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

export function dismissError(key) {
  return {
    type: DISMISS_ERROR,
    key,
  };
}
