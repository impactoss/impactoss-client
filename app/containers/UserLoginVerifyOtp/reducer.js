/*
 *
 * UserLoginVerifyOtp reducer
 *
 */

import { fromJS } from 'immutable';
import { LOCATION_CHANGE } from 'react-router-redux';
import { combineReducers } from 'redux-immutable';

import { checkResponseError } from 'utils/request';

import {
  VERIFY_OTP_SENDING,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_ERROR,
  RESEND_OTP_SENDING,
  RESEND_OTP_SUCCESS,
  RESEND_OTP_ERROR,
  RESET_ERRORS,
} from './constants';

const initialState = fromJS({
  authSending: false,
  authSuccess: false,
  authError: false,
  resendSending: false,
  resendSuccess: false,
  resendError: false,
});
function verifyOtpReducer(state = initialState, action) {
  switch (action.type) {
    case LOCATION_CHANGE:
      return initialState;
    case VERIFY_OTP_SENDING:
      return state
        .set('authSending', true)
        .set('authSuccess', false)
        .set('authError', false);
    case VERIFY_OTP_SUCCESS:
      return state
        .set('authSending', false)
        .set('authSuccess', true);
    case VERIFY_OTP_ERROR:
      return state
        .set('authSending', false)
        .set('authSuccess', false)
        .set('authError', checkResponseError(action.error));
    case RESEND_OTP_SENDING:
      return state
        .set('resendSending', true)
        .set('resendSuccess', false)
        .set('resendError', false);
    case RESEND_OTP_SUCCESS:
      return state
        .set('resendSending', false)
        .set('resendSuccess', true);
    case RESEND_OTP_ERROR:
      return state
        .set('resendSending', false)
        .set('resendSuccess', false)
        .set('resendError', checkResponseError(action.error));
    case RESET_ERRORS:
      return state
        .set('resendError', false)
        .set('authError', false);
    default:
      return state;
  }
}

export default combineReducers({
  page: verifyOtpReducer,
});
