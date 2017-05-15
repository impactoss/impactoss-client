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
  resetState,
} from './actions';

import {
  SAVE_EDITS,
  UPDATE_QUERY,
  UPDATE_GROUP,
} from './constants';

export function* updateQuery(args) {
  const params = args.value.map((value) => ({
    arg: value.get('query'),
    value: value.get('value'),
    replace: value.get('replace'),
    add: value.get('checked'),
    remove: !value.get('checked'),
  })).toJS();
  yield put(updateRouteQuery(params));
}
export function* updateGroup(args) {
  const params = args.value.map((value) => ({
    arg: value.get('query'),
    value: value.get('value'),
    replace: true,
    add: value.get('value') !== '',
    remove: value.get('value') === '',
  })).toJS();
  yield put(updateRouteQuery(params));
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
}

export function* locationChangeSaga() {
  // reset list if path changed
  const location = yield select(selectLocation);
  if (location.get('pathname') !== location.get('pathnamePrevious')) {
    yield put(resetState());
  }
}

export default function* entityList() {
  yield takeLatest(UPDATE_QUERY, updateQuery);
  yield takeLatest(UPDATE_GROUP, updateGroup);

  yield takeLatest(SAVE_EDITS, saveEdits);
  yield takeLatest(LOCATION_CHANGE, locationChangeSaga);
}
