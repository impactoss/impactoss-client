import { takeLatest, put } from 'redux-saga/effects';

import {
  updateRouteQuery,
} from 'containers/App/actions';

import {
  FILTER_FORM_MODEL,
} from './constants';

export function* updateQuery(args) {
  const params = args.value.map((value) => ({
    arg: value.get('query'),
    value: value.get('value') || 1,
    replace: value.get('replace'),
    add: value.get('checked'),
    remove: !value.get('checked'),
  })).toJS();
  yield put(updateRouteQuery(params));
}

export default function* entityList() {
  // filter form changed
  yield takeLatest(
    (action) =>
      action.model === `${FILTER_FORM_MODEL}.values` && action.type === 'rrf/change',
    updateQuery
  );
}
