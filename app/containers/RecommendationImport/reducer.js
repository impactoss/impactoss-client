/*
 *
 * RecommendationImport reducer
 *
 */
import { combineReducers } from 'redux-immutable';

import { entityImportReducer } from 'containers/App/entityImportReducer';

export default combineReducers({
  page: entityImportReducer,
});
