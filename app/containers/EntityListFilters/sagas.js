import { takeLatest, select } from 'redux-saga/effects';
import { browserHistory } from 'react-router';
import { filtersCheckedSelector } from './selectors';
// import { credentialsSelector } from './selectors';

export function* doFilter() {
  const URLSearchParams = yield select(filtersCheckedSelector);
  const location = browserHistory.getCurrentLocation();
  browserHistory.replace(`${location.pathname}?${URLSearchParams.toString()}`);
}

export default function* filterSaga() {
  yield takeLatest((action) =>
  action.type === 'rrf/change' && action.model === 'entityListFilters.form.data.values', doFilter);
}
