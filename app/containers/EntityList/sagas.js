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
} from './constants';

export function* updateQuery(args) {
  const params = args.value.map((value) => ({
    arg: value.get('query'),
    value: value.get('value'),
    replace: value.get('replace'),
    add: value.get('checked'),
    remove: !value.get('checked'),
  })).toJS();
  yield params.push({
    arg: 'page',
    value: '',
    replace: true,
    remove: true,
  });
  yield put(updateRouteQuery(params));
}
export function* updateGroup(args) {
  const params = args.value.map((value) => ({
    arg: value.get('query'),
    value: value.get('value'),
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
export function* updatePage(args) {
  yield put(updateRouteQuery({
    arg: 'page',
    value: args.page,
    replace: true,
  }));
}
export function* updatePageItems(args) {
  yield put(updateRouteQuery([
    {
      arg: 'items',
      value: args.no,
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
export function* updateExpand(args) {
  yield put(updateRouteQuery({
    arg: 'expand',
    value: args.expand,
    replace: true,
  }));
}
export function* updateSortBy(args) {
  yield put(updateRouteQuery({
    arg: 'sort',
    value: args.sort,
    replace: true,
  }));
}
export function* updateSortOrder(args) {
  yield put(updateRouteQuery({
    arg: 'order',
    value: args.order,
    replace: true,
  }));
}

export function* save({ data }) {
  yield put(saveEntity({
    path: data.path,
    entity: data.entity,
    redirect: false,
  }));
}

export function* newConnection({ data }) {
  yield put(newEntity({
    path: data.path,
    entity: data.entity,
    redirect: false,
  }));
}

export function* deleteConnection({ data }) {
  yield put(deleteEntity({
    path: data.path,
    id: data.id,
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

  yield takeLatest(SAVE, save);
  yield takeLatest(NEW_CONNECTION, newConnection);
  yield takeLatest(DELETE_CONNECTION, deleteConnection);
}
