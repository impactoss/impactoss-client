import { takeLatest, put, select } from 'redux-saga/effects';

import { LOCATION_CHANGE } from 'react-router-redux';

import {
  updateConnections,
  updateEntities,
  updateRouteQuery,
} from 'containers/App/actions';

import {
  selectLocation,
} from 'containers/App/selectors';

import {
  hideFilterForm,
  hideEditForm,
  resetState,
} from './actions';

import {
  FILTER_FORM_MODEL,
  SAVE_EDITS,
  UPDATE_QUERY,
} from './constants';

export function* updateQuery(args) {
  const params = args.value.map((value) => ({
    arg: value.get('query'),
    value: value.get('value'),
    add: value.get('checked'),
    remove: !value.get('checked'),
  })).toJS();
  yield put(updateRouteQuery(params));
  yield put(hideFilterForm());
}

export function* saveEdits({ data }) {
  if (data.attributes) {
    // data = { attributes: true, path: path, entities: [
    //  { id: id, attributes: {...} },
    //  { id: id, attributes: {...} }, ...
    // ]}
    yield put(updateEntities(data));
  } else {
    // data = { attributes: true, path: path, updates: {
    //   creates: [{entity_id, assignedId}, ...],
    //   deletes: [assignment, ids,...]
    // }}
    yield put(updateConnections(data));
  }
  yield put(hideEditForm());
}

export function* locationChangeSaga() {
  // reset list if path changed
  const location = yield select(selectLocation);
  if (location.get('pathname') !== location.get('pathnamePrevious')) {
    yield put(resetState());
  }
}

export default function* entityList() {
  // filter form changed
  yield takeLatest(
    (action) =>
      action.model === `${FILTER_FORM_MODEL}.values` && action.type === 'rrf/change',
    updateQuery
  );
  yield takeLatest(UPDATE_QUERY, updateQuery);

  yield takeLatest(SAVE_EDITS, saveEdits);
  yield takeLatest(LOCATION_CHANGE, locationChangeSaga);
}
