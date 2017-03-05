import { take, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { ACTION_ENTITY_NOT_FOUND } from 'containers/App/constants'

export function* actionNotFound() {
  console.log('not found!');
}

// Individual exports for testing
export function* defaultSaga() {
  const notFoundWatcher = yield takeLatest(ACTION_ENTITY_NOT_FOUND, actionNotFound);
  yield take(LOCATION_CHANGE);
  yield cancel(notFoundWatcher);
}

// All sagas to be loaded
export default [
  defaultSaga,
];
