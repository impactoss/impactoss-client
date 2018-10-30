import { take, put, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { newEntity } from 'containers/App/actions';
import { PATHS } from 'containers/App/constants';

import { SAVE } from './constants';

export function* save({ data }) {
  yield put(newEntity({
    path: 'pages',
    entity: data,
    redirect: PATHS.PAGES,
  }));
}

export function* defaultSaga() {
  const saveWatcher = yield takeLatest(SAVE, save);

  yield take(LOCATION_CHANGE);

  yield cancel(saveWatcher);
}

// All sagas to be loaded
export default [
  defaultSaga,
];
