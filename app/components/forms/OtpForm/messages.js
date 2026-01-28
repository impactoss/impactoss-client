import { defineMessages } from 'react-intl';

export default defineMessages({
  otpCode: {
    id: 'app.components.OtpForm.otpCode',
    defaultMessage: 'Verification Code',
  },
  otpCodeRequired: {
    id: 'app.components.OtpForm.otpCodeRequired',
    defaultMessage: 'Verification code is required',
  },
  otpCodeInvalid: {
    id: 'app.components.OtpForm.otpCodeInvalid',
    defaultMessage: 'Please enter a 6-digit code',
  },
  otpHelpText: {
    id: 'app.components.OtpForm.otpHelpText',
    defaultMessage: 'Enter the 6-digit code sent to your email. The code will expire in 10 minutes.',
  },
  resendOtp: {
    id: 'app.components.OtpForm.resendOtp',
    defaultMessage: 'Resend code',
  },
  submit: {
    id: 'app.components.OtpForm.submit',
    defaultMessage: 'Verify',
  },
  cancel: {
    id: 'app.components.OtpForm.cancel',
    defaultMessage: 'Cancel',
  },
});
