import { fromJS } from 'immutable';

import { LOCATION_CHANGE } from 'react-router-redux';

import {
  SAVE_SENDING,
  SAVE_ERROR,
  SAVE_SUCCESS,
  RESET_PROGRESS,
  LOGOUT_SUCCESS,
} from 'containers/App/constants';

import { checkResponseError } from 'utils/request';

export const IMPORT_ORIGIN = 'entity-import';

const initialState = fromJS({
  sending: {},
  success: {},
  errors: {},
});

export const entityImportReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT_SUCCESS:
      return initialState;
    case RESET_PROGRESS:
    case LOCATION_CHANGE:
      return initialState;
    case SAVE_SENDING:
      return action.data && action.data.origin === IMPORT_ORIGIN
        ? state.setIn(['sending', action.data.timestamp], action.data)
        : state;
    case SAVE_SUCCESS:
      return action.data && action.data.origin === IMPORT_ORIGIN
        ? state.setIn(['success', action.data.timestamp], action.data)
        : state;
    case SAVE_ERROR:
      return action.data && action.data.origin === IMPORT_ORIGIN
        ? state.setIn(
          ['errors', action.data.timestamp],
          { data: action.data, error: checkResponseError(action.error) }
        )
        : state;
    default:
      return state;
  }
};
