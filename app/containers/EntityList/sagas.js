import { takeLatest, put } from 'redux-saga/effects';
// import { credentialsSelector } from './selectors';
import {
  updateConnections,
  updateEntities,
  updateRouteQuery,
} from 'containers/App/actions';

import {
  hideEditForm,
} from './actions';

import {
  FILTER_FORM_MODEL,
  SAVE_EDITS,
} from './constants';

export function* updateQuery(args) {
  const params = args.value.map((value) => ({
    arg: value.get('query'),
    value: value.get('value'),
    add: value.get('checked'),
    remove: !value.get('checked'),
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
  yield put(hideEditForm());
}

// Individual exports for testing
export default function* entityList() {
  yield takeLatest(
    (action) => action.type === 'rrf/change' && action.model === `${FILTER_FORM_MODEL}.values`,
    updateQuery
  );

  yield takeLatest(SAVE_EDITS, saveEdits);
}
