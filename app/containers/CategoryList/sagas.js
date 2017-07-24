import { take, takeLatest, put, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import {
  updateRouteQuery,
} from 'containers/App/actions';

import {
  SORT_CHANGE,
} from './constants';

export function* updateSort(args) {
  // yield console.log('updateSort saga', args)
  yield put(updateRouteQuery([
    {
      arg: 'sort',
      value: args.sort,
      replace: true,
    },
    {
      arg: 'order',
      value: args.order,
      replace: true,
    },
  ]));
}

export function* defaultSaga() {
  const sortWatcher = yield takeLatest(SORT_CHANGE, updateSort);
  yield take(LOCATION_CHANGE);
  yield cancel(sortWatcher);
}

// All sagas to be loaded
export default [
  defaultSaga,
];
