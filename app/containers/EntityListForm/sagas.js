import { takeLatest, put } from 'redux-saga/effects';

import {
  updateRouteQuery,
} from 'containers/App/actions';

import {
  SET_FILTER,
} from './constants';

export function* updateQuery({ values }) {
  const params = values.map((value) => ({
    arg: value.get('query'),
    value: value.get('value') || 1,
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

export default function* entityList() {
  // filter form changed
  yield takeLatest(SET_FILTER, updateQuery);
}
