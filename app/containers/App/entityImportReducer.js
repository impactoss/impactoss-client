import { fromJS } from 'immutable';

import { LOCATION_CHANGE } from 'react-router-redux';

import {
  SAVE_SENDING,
  SAVE_ERROR,
  SAVE_SUCCESS,
  RESET_PROGRESS,
} from 'containers/App/constants';

import { checkResponseError } from 'utils/request';

const initialState = fromJS({
  sending: {},
  success: {},
  errors: {},
});

export const entityImportReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESET_PROGRESS:
    case LOCATION_CHANGE:
      return initialState;
    case SAVE_SENDING:
      return action.data ? state.setIn(['sending', action.data.timestamp], action.data) : state;
    case SAVE_SUCCESS:
      return action.data ? state.setIn(['success', action.data.timestamp], action.data) : state;
    case SAVE_ERROR:
      return action.data ? state.setIn(['errors', action.data.timestamp], checkResponseError(action.error)) : state;
    default:
      return state;
  }
};
