import { takeLatest, put, take, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import {
  updateRouteQuery,
} from 'containers/App/actions';

import {
  UPDATE_QUERY,
  RESET_SEARCH_QUERY,
  SORTBY_CHANGE,
  SORTORDER_CHANGE,
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


export function* defaultSaga() {
  const watcherQuery = yield takeLatest(UPDATE_QUERY, updateQuery);
  const watcherReset = yield takeLatest(RESET_SEARCH_QUERY, resetSearchQuery);
  const watcherSortBy = yield takeLatest(SORTBY_CHANGE, updateSortBy);
  const watcherSortOrder = yield takeLatest(SORTORDER_CHANGE, updateSortOrder);

  yield take(LOCATION_CHANGE);

  yield cancel(watcherQuery);
  yield cancel(watcherReset);
  yield cancel(watcherSortBy);
  yield cancel(watcherSortOrder);
}

// All sagas to be loaded
export default [
  defaultSaga,
];
