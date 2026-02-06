import {
  call, takeLatest, put, take, cancel, select,
} from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import apiRequest from 'utils/api-request';

import { ENDPOINTS } from 'themes/config';

import {
  selectOtpTempToken,
} from 'containers/App/selectors';

import {
  resetOtp,
  invalidateEntities,
  forwardOnAuthenticationChange,
  authenticateSuccess,
} from 'containers/App/actions';

import {
  verifyOtpSending,
  verifyOtpSuccess,
  verifyOtpError,
  resendOtpSuccess,
  resendOtpSending,
  resendOtpError,
} from './actions';

import { VERIFY_OTP, RESEND_OTP } from './constants';

export function* verifyOtpSaga({ otpCode }) {
  const tempToken = yield select(selectOtpTempToken);
  try {
    yield put(verifyOtpSending());
    const response = yield call(
      apiRequest,
      'post',
      ENDPOINTS.VERIFY_OTP,
      { temp_token: tempToken, otp_code: otpCode },
    );
    yield put(verifyOtpSuccess());
    yield put(authenticateSuccess(response.data)); // need to store currentUserData
    yield put(resetOtp());
    yield put(invalidateEntities()); // important invalidate before forward to allow for reloading of entities
    yield put(forwardOnAuthenticationChange());
  } catch (err) {
    console.log('ERROR in verifyOtpSaga');
    if (err.response) {
      err.response.json = yield err.response.json();
    }
    yield put(verifyOtpError(err));
  }
}

export function* resendOtpSaga() {
  const tempToken = yield select(selectOtpTempToken);
  try {
    yield put(resendOtpSending());
    const response = yield call(apiRequest, 'post', ENDPOINTS.RESEND_OTP, { temp_token: tempToken });
    yield put(resendOtpSuccess(response.message));
  } catch (err) {
    console.log('ERROR in resendOtpSaga');
    if (err.response) {
      err.response.json = yield err.response.json();
    }
    yield put(resendOtpError(err));
  }
}


export function* defaultSaga() {
  const watcher = yield takeLatest(VERIFY_OTP, verifyOtpSaga);
  const watcherResend = yield takeLatest(RESEND_OTP, resendOtpSaga);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
  yield cancel(watcherResend);
}

export default [
  defaultSaga,
];
