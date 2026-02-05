/*
 *
 * VerifyOtp actions
 *
 */
import {
  VERIFY_OTP,
  VERIFY_OTP_SENDING,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_ERROR,
  RESEND_OTP,
  RESEND_OTP_SENDING,
  RESEND_OTP_SUCCESS,
  RESEND_OTP_ERROR,
  RESET_ERRORS,
} from './constants';


export function verifyOtp(otpCode) {
  return {
    type: VERIFY_OTP,
    otpCode,
  };
}

export function verifyOtpSending() {
  return {
    type: VERIFY_OTP_SENDING,
  };
}

export function verifyOtpSuccess(user) {
  return {
    type: VERIFY_OTP_SUCCESS,
    user,
  };
}

export function verifyOtpError(error) {
  return {
    type: VERIFY_OTP_ERROR,
    error,
  };
}

export function resendOtp(otpTempToken) {
  return {
    type: RESEND_OTP,
    otpTempToken,
  };
}

export function resendOtpSending(message) {
  return {
    type: RESEND_OTP_SENDING,
    message,
  };
}

export function resendOtpSuccess(message) {
  return {
    type: RESEND_OTP_SUCCESS,
    message,
  };
}

export function resendOtpError(error) {
  return {
    type: RESEND_OTP_ERROR,
    error,
  };
}
export function resetErrors() {
  return {
    type: RESET_ERRORS,
  };
}
