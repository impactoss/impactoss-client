import { takeLatest, put } from 'redux-saga/effects';

import {
  saveEntity,
  newEntity,
  deleteEntity,
  updateRouteQuery,
} from 'containers/App/actions';

import {
  SAVE,
  NEW_CONNECTION,
  DELETE_CONNECTION,
  UPDATE_QUERY,
  UPDATE_GROUP,
  PAGE_CHANGE,
  EXPAND_CHANGE,
  PAGE_ITEM_CHANGE,
  SORTBY_CHANGE,
  SORTORDER_CHANGE,
  RESET_SEARCH_QUERY,
} from './constants';

export function* updateQuery({ value }) {
  const params = value.map((val) => ({
    arg: val.get('query'),
    value: val.get('value'),
    replace: val.get('replace'),
    add: val.get('checked'),
    remove: !val.get('checked'),
  })).toJS();
  yield params.push({
    arg: 'page',
    value: '',
    replace: true,
    remove: true,
  });
  yield put(updateRouteQuery(params));
}

export function* resetSearchQuery({ values }) {
  const params = values.map((arg) => ({
    arg,
    value: '',
    replace: true,
    remove: true,
  }));
  yield put(updateRouteQuery(params));
}

export function* updateGroup({ value }) {
  const params = value.map((val) => ({
    arg: val.get('query'),
    value: val.get('value'),
    replace: true,
    // add: value.get('value') !== '',
    // remove: value.get('value') === '',
  })).toJS();
  yield params.push({
    arg: 'page',
    value: '',
    replace: true,
    remove: true,
  });
  yield put(updateRouteQuery(params));
}
export function* updatePage({ page }) {
  yield put(updateRouteQuery({
    arg: 'page',
    value: page,
    replace: true,
  }));
}
export function* updatePageItems({ no }) {
  yield put(updateRouteQuery([
    {
      arg: 'items',
      value: no,
      replace: true,
    },
    {
      arg: 'page',
      value: '',
      replace: true,
      remove: true,
    },
  ]));
}
export function* updateExpand({ expand }) {
  yield put(updateRouteQuery({
    arg: 'expand',
    value: expand,
    replace: true,
  }));
}
export function* updateSortBy({ sort }) {
  yield put(updateRouteQuery({
    arg: 'sort',
    value: sort,
    replace: true,
  }));
}
export function* updateSortOrder({ order }) {
  yield put(updateRouteQuery({
    arg: 'order',
    value: order,
    replace: true,
  }));
}

export function* save({ data }) {
  yield put(saveEntity({
    path: data.path,
    entity: data.entity,
    saveRef: data.saveRef,
    redirect: false,
  }));
}

export function* newConnection({ data }) {
  yield put(newEntity({
    path: data.path,
    entity: data.entity,
    saveRef: data.saveRef,
    redirect: false,
  }));
}

export function* deleteConnection({ data }) {
  yield put(deleteEntity({
    path: data.path,
    id: data.id,
    saveRef: data.saveRef,
    redirect: false,
  }));
}

export default function* entityList() {
  yield takeLatest(UPDATE_QUERY, updateQuery);
  yield takeLatest(UPDATE_GROUP, updateGroup);
  yield takeLatest(PAGE_CHANGE, updatePage);
  yield takeLatest(PAGE_ITEM_CHANGE, updatePageItems);
  yield takeLatest(EXPAND_CHANGE, updateExpand);
  yield takeLatest(SORTBY_CHANGE, updateSortBy);
  yield takeLatest(SORTORDER_CHANGE, updateSortOrder);
  yield takeLatest(RESET_SEARCH_QUERY, resetSearchQuery);

  yield takeLatest(SAVE, save);
  yield takeLatest(NEW_CONNECTION, newConnection);
  yield takeLatest(DELETE_CONNECTION, deleteConnection);
}
