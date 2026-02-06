/*
 * UserLoginVerifyOtp Messages
 *
 * This contains all the text for the UserLoginVerifyOtp component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  pageTitle: {
    id: 'app.containers.UserLoginVerifyOtp.pageTitle',
    defaultMessage: 'Enter verification code',
  },
  metaDescription: {
    id: 'app.containers.UserLoginVerifyOtp.metaDescription',
    defaultMessage: 'Sign in page description',
  },
  titleSignIn: {
    id: 'app.containers.UserLoginVerifyOtp.titleSignIn',
    defaultMessage: 'Verify your identity',
  },
  titleRegister: {
    id: 'app.containers.UserLoginVerifyOtp.titleRegister',
    defaultMessage: 'Account created',
  },
  titleCodeResent: {
    id: 'app.containers.UserLoginVerifyOtp.titleCodeResent',
    defaultMessage: 'Code resent',
  },
  descriptionSignIn: {
    id: 'app.containers.UserLoginVerifyOtp.descriptionSignIn',
    defaultMessage: 'Please check your email and enter the verification code to complete your sign in.',
  },
  descriptionRegister: {
    id: 'app.containers.UserLoginVerifyOtp.descriptionRegister',
    defaultMessage: 'Enter the verification code sent to your email to sign in right away.',
  },
  descriptionCodeResent: {
    id: 'app.containers.UserLoginVerifyOtp.descriptionCodeResent',
    defaultMessage: 'Verification code resent. Please check your email again and enter the code.',
  },
  submit: {
    id: 'app.containers.UserLoginVerifyOtp.submit',
    defaultMessage: 'Submit',
  },
  resendCodeLinkBefore: {
    id: 'app.containers.UserLoginVerifyOtp.resendCodeLinkBefore',
    defaultMessage: 'Did not receive the code? ',
  },
  resendCodeLink: {
    id: 'app.containers.UserLoginVerifyOtp.resendCodeLink',
    defaultMessage: 'Resend code',
  },
  resendCodeLinkAfter: {
    id: 'app.containers.UserLoginVerifyOtp.resendCodeLinkAfter',
    defaultMessage: 'Please also make sure to check your Spam folder or contact Email administrator',
  },
});
