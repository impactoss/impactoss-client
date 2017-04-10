import { takeLatest, select, put } from 'redux-saga/effects';
import { browserHistory } from 'react-router';
// import { credentialsSelector } from './selectors';
import { updateConnections } from 'containers/App/actions';

import { filtersCheckedSelector } from './selectors';

import {
  FILTER_FORM_MODEL,
  SAVE_EDITS,
} from './constants';

export function* doFilter() {
  const URLSearchParams = yield select(filtersCheckedSelector);
  const location = browserHistory.getCurrentLocation();
  browserHistory.replace(`${location.pathname}?${URLSearchParams.toString()}`);
}

export function* saveEdits({ data }) {
  if (!data.attributes) {
    yield put(updateConnections(data));
  }
}

// Individual exports for testing
export default function* entityList() {
  yield takeLatest(
    (action) => action.type === 'rrf/change' && action.model === `${FILTER_FORM_MODEL}.values`,
    doFilter
  );

  yield takeLatest(SAVE_EDITS, saveEdits);
}
