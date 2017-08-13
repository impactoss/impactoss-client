/*
 *
 * UserPasswordRecover reducer
 *
 */

import { LOCATION_CHANGE } from 'react-router-redux';
import { fromJS } from 'immutable';
import { checkResponseError } from 'utils/request';

import { combineReducers } from 'redux-immutable';
import { combineForms } from 'react-redux-form/immutable';


import {
  RECOVER_SENDING,
  RECOVER_SUCCESS,
  RECOVER_ERROR,
} from 'containers/App/constants';

const initialState = fromJS({
  sending: false,
  success: false,
  error: false,
});

function passwordRecoverReducer(state = initialState, action) {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case RECOVER_SENDING:
      return state
        .set('sending', true)
        .set('success', false)
        .set('error', false);
    case RECOVER_SUCCESS:
      return state
        .set('sending', false)
        .set('success', true);
    case RECOVER_ERROR:
      return state
        .set('sending', false)
        .set('success', false)
        .set('error', checkResponseError(action.error));
    default:
      return state;
  }
}

const formData = fromJS({
  email: '',
});

export default combineReducers({
  page: passwordRecoverReducer,
  form: combineForms({
    data: formData,
  }, 'userPasswordRecover.form'),
});
