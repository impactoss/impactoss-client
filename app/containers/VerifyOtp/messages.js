/*
 * VerifyOtp Messages
 *
 * This contains all the text for the VerifyOtp component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  pageTitle: {
    id: 'app.containers.VerifyOtp.pageTitle',
    defaultMessage: 'Enter verification code',
  },
  metaDescription: {
    id: 'app.containers.VerifyOtp.metaDescription',
    defaultMessage: 'Sign in page description',
  },
  titleSignIn: {
    id: 'app.containers.VerifyOtp.titleSignIn',
    defaultMessage: 'Verify your identity',
  },
  titleRegister: {
    id: 'app.containers.VerifyOtp.titleRegister',
    defaultMessage: 'Account created',
  },
  titleCodeResent: {
    id: 'app.containers.VerifyOtp.titleCodeResent',
    defaultMessage: 'Code resent',
  },
  descriptionSignIn: {
    id: 'app.containers.VerifyOtp.descriptionSignIn',
    defaultMessage: 'Please check your email and enter the verification code to complete your sign in.',
  },
  descriptionRegister: {
    id: 'app.containers.VerifyOtp.descriptionRegister',
    defaultMessage: 'Enter the verification code sent to your email to sign in right away.',
  },
  descriptionCodeResent: {
    id: 'app.containers.VerifyOtp.descriptionCodeResent',
    defaultMessage: 'Verification code resent. Please check your email again and enter the code.',
  },
  submit: {
    id: 'app.containers.VerifyOtp.submit',
    defaultMessage: 'Submit',
  },
  resendCodeLinkBefore: {
    id: 'app.containers.VerifyOtp.resendCodeLinkBefore',
    defaultMessage: 'Did not receive the code? ',
  },
  resendCodeLink: {
    id: 'app.containers.VerifyOtp.resendCodeLink',
    defaultMessage: 'Resend code',
  },
  resendCodeLinkAfter: {
    id: 'app.containers.VerifyOtp.resendCodeLinkAfter',
    defaultMessage: 'Please also make sure to check your Spam folder or contact Email administrator',
  },
});
