import { take } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';


// Individual exports for testing
export function* defaultSaga() {
  yield take(LOCATION_CHANGE);
}

// All sagas to be loaded
export default [
  defaultSaga,
];
