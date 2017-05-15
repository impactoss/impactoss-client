import { takeLatest, take, put, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { saveEntity, invalidateEntities } from 'containers/App/actions';

import { SAVE } from './constants';


export function* save({ data }) {
  yield put(saveEntity({
    path: 'pages',
    entity: data,
    redirect: `/pages/${data.id}`,
  }));
  // force due_date reload to get newly generated due_dates
  yield put(invalidateEntities('due_dates'));
}

// Individual exports for testing
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
  const saveWatcher = yield takeLatest(SAVE, save);

  yield take(LOCATION_CHANGE);
  yield cancel(saveWatcher);
}

// All sagas to be loaded
export default [
  defaultSaga,
];
