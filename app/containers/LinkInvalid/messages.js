/*
 * LinkInvalid Messages
 *
 * This contains all the text for the LinkInvalid component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  metaDescription: {
    id: 'app.containers.LinkInvalid.metaDescription',
    defaultMessage: 'Link invalid page',
  },
  pageTitle: {
    id: 'app.containers.LinkInvalid.pageTitle',
    defaultMessage: 'Invalid password reset link',
  },
  info: {
    id: 'app.containers.LinkInvalid.info',
    defaultMessage: 'We are sorry but the password reset link is not or no longer valid. ',
  },
  loginLinkBefore: {
    id: 'app.containers.LinkInvalid.loginLinkBefore',
    defaultMessage: 'If you have already reset your password: ',
  },
  loginLink: {
    id: 'app.containers.LinkInvalid.loginLink',
    defaultMessage: 'Sign in here',
  },
  recoverLinkBefore: {
    id: 'app.containers.LinkInvalid.loginLink',
    defaultMessage: 'Need a new reset link? ',
  },
  recoverPasswordLink: {
    id: 'app.containers.LinkInvalid.recoverPasswordLink',
    defaultMessage: 'Recover your password here',
  },
});
