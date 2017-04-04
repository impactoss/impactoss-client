import { takeLatest, select } from 'redux-saga/effects';
import { browserHistory } from 'react-router';
import { filtersCheckedSelector } from './selectors';
// import { credentialsSelector } from './selectors';

import {
  FILTER_FORM_MODEL,
} from './constants';

export function* doFilter() {
  const URLSearchParams = yield select(filtersCheckedSelector);
  const location = browserHistory.getCurrentLocation();
  browserHistory.replace(`${location.pathname}?${URLSearchParams.toString()}`);
}

export default function* filterSaga() {
  yield takeLatest((action) =>
  action.type === 'rrf/change' && action.model === `${FILTER_FORM_MODEL}.values`, doFilter);
}
