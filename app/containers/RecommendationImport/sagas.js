import {
  take, put, cancel, takeEvery,
} from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { newEntity } from 'containers/App/actions';
import { IMPORT_ORIGIN } from 'containers/App/entityImportReducer';

import { SAVE } from './constants';

export function* save({ data }) {
  yield put(newEntity(
    // data
    {
      path: 'recommendations',
      entity: data,
      redirect: false,
      saveRef: data.saveRef,
    },
    // origin
    IMPORT_ORIGIN,
  ));
}


export function* defaultSaga() {
  const saveWatcher = yield takeEvery(SAVE, save);

  yield take(LOCATION_CHANGE);

  yield cancel(saveWatcher);
}

// All sagas to be loaded
export default [
  defaultSaga,
];
