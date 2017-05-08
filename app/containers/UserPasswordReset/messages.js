/*
 * UserPasswordReset Messages
 *
 * This contains all the text for the UserPasswordReset component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  pageTitle: {
    id: 'app.container.UserPasswordReset.pageTitle',
    defaultMessage: 'Reset Password',
  },
  metaDescription: {
    id: 'app.container.UserPasswordReset.metaDescription',
    defaultMessage: 'Password reset page description',
  },
  header: {
    id: 'nmrf.containers.UserPasswordReset.header',
    defaultMessage: 'Reset Password',
  },
  fieldRequired: {
    id: 'app.containers.UserPasswordReset.header',
    defaultMessage: 'Required',
  },
  fields: {
    email: {
      placeholder: {
        id: 'app.containers.UserPasswordReset.fields.email.placeholder',
        defaultMessage: 'Email address',
      },
    },
  },
  submit: {
    id: 'nmrf.containers.UserPasswordReset.submit',
    defaultMessage: 'Reset',
  },
});
