import { takeLatest, select, put } from 'redux-saga/effects';
import { browserHistory } from 'react-router';
// import { credentialsSelector } from './selectors';
import { updateConnections, updateEntities } from 'containers/App/actions';

import { filtersCheckedSelector } from './selectors';

import {
  FILTER_FORM_MODEL,
  SAVE_EDITS,
} from './constants';

export function* updateQuery() {
  const values = yield select(filtersCheckedSelector);
  const location = browserHistory.getCurrentLocation();
  // console.log(values)
  // console.log(location)
  // console.log(new URLSearchParams())
  // might want some intesection logic here, as this is going to replace all existing params ( but maybe that's ok )
  // some way to remove all the existing params that we are using before appending
  // SEE https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
  const params = values.reduce((URLParams, value) => {
    URLParams.append(value.get('query'), value.get('value'));
    return URLParams;
  }, new URLSearchParams());
  // not sure how this works but this line magically removes options when params is empty
  // and correctly appends options to already existing ones
  browserHistory.replace(`${location.pathname}?${params.toString()}`);
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

// Individual exports for testing
export default function* entityList() {
  yield takeLatest(
    (action) => action.type === 'rrf/change' && action.model === `${FILTER_FORM_MODEL}.values`,
    updateQuery
  );

  yield takeLatest(SAVE_EDITS, saveEdits);
}
