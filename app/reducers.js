/**
 * Combine all reducers in this file and export the combined reducers.
 * If we were to do this in store.js, reducers wouldn't be hot reloadable.
 */
import { fromJS } from 'immutable';
import { combineReducers } from 'redux-immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
import { browserHistory } from 'react-router';

import { startsWith } from 'utils/string';

import globalReducer from 'containers/App/reducer';
import languageProviderReducer from 'containers/LanguageProvider/reducer';
import entityNewReducer from 'containers/EntityNew/reducer';
import entityListReducer from 'containers/EntityList/reducer';
import entityListFormReducer from 'containers/EntityListForm/reducer';

/*
 * routeReducer
 *
 * The reducer merges route location changes into our immutable state.
 * The change is necessitated by moving to react-router-redux@4
 *
 */
// Initial routing state
const routeInitialState = fromJS({
  locationBeforeTransitions: Object.assign(browserHistory.getCurrentLocation(), {
    listSearch: '',
    pathnamePrevious: '',
  }),
});

const listPaths = ['/actions', '/recommendations', '/indicators', '/sdgtargets'];

/**
 * Merge route into the global application state and remember previous route
 */
function routeReducer(state = routeInitialState, action) {
  switch (action.type) {
    /* istanbul ignore next */
    case LOCATION_CHANGE: {
      const pathName = state.getIn(['locationBeforeTransitions', 'pathname']);
      return state.merge({
        locationBeforeTransitions: {
          ...action.payload,
          listSearch: listPaths.indexOf(pathName) > -1 || startsWith(pathName, '/categories')
            ? state.getIn(['locationBeforeTransitions', 'search'])
            : state.getIn(['locationBeforeTransitions', 'listSearch']),
          pathnamePrevious: state.getIn(['locationBeforeTransitions', 'pathname']),
        },
      });
    }
    default:
      return state;
  }
}

/**
 * Creates the main reducer with the asynchronously loaded ones
 */
export default function createReducer(asyncReducers) {
  return combineReducers({
    route: routeReducer,
    global: globalReducer,
    language: languageProviderReducer,
    entityNew: entityNewReducer,
    entityList: entityListReducer,
    entityListForm: entityListFormReducer,
    ...asyncReducers,
  });
}
