/*
*
* EntityListFilters reducer
*
*/

import { fromJS, List } from 'immutable';
import { combineReducers } from 'redux-immutable';

import { LOCATION_CHANGE } from 'react-router-redux';

import {
  SAVE_SENDING,
  SAVE_ERROR,
  SAVE_SUCCESS,
  DELETE_SENDING,
  DELETE_ERROR,
  DELETE_SUCCESS,
  FILTERS_PANEL,
  EDIT_PANEL,
} from 'containers/App/constants';

import {
  SHOW_PANEL,
  RESET_STATE,
  ENTITY_SELECTED,
  ENTITIES_SELECT,
} from './constants';

const initialState = fromJS({
  activePanel: FILTERS_PANEL,
  entitiesSelected: [],
  sending: false,
  success: false,
  error: false,
});

function entityListReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_PANEL: {
      const updated = state.set('activePanel', action.activePanel);
      // reset selected if filters panel activated
      return action.activePanel === FILTERS_PANEL
        ? updated.set('entitiesSelected', List())
        : updated;
    }
    case RESET_STATE:
      return initialState;
    case ENTITY_SELECTED: {
      const selected = state.get('entitiesSelected');
      return state
        .set('entitiesSelected', action.data.checked
          ? selected.push(action.data.id)
          : selected.filterNot((id) => id === action.data.id))
        .set('activePanel', EDIT_PANEL);
    }
    case ENTITIES_SELECT:
      return state
        .set('entitiesSelected', fromJS(action.ids))
        .set('activePanel', EDIT_PANEL);
    case LOCATION_CHANGE:
      // reset selected entities on query change (location changes but not path)
      // TODO do not reset entitiesSelected on 'expand'
      return state.getIn(['route', 'locationBeforeTransition', 'pathname']) === state.getIn(['route', 'locationBeforeTransition', 'pathnamePrevious'])
        ? state.set('entitiesSelected', List())
        : state;
    case DELETE_SENDING:
    case SAVE_SENDING:
      return state.set('sending', action);
    case DELETE_SUCCESS:
    case SAVE_SUCCESS:
      return state.set('success', action);
    case DELETE_ERROR:
    case SAVE_ERROR:
      return state.set('error', action);
    default:
      return state;
  }
}

export default combineReducers({
  page: entityListReducer,
});
