/*
 *
 * PageNew reducer
 *
 */

import { combineReducers } from 'redux-immutable';

import { entityFormReducer } from 'containers/App/entityFormReducer';

export default combineReducers({
  page: entityFormReducer,
});
