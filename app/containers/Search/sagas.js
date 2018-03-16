import { takeLatest, put, take, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import {
  updateRouteQuery,
} from 'containers/App/actions';

import {
  UPDATE_QUERY,
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

export function* defaultSaga() {
  const watcher = yield takeLatest(UPDATE_QUERY, updateQuery);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);

  yield takeLatest(RESET_SEARCH_QUERY, resetSearchQuery);
}

// All sagas to be loaded
export default [
  defaultSaga,
];
