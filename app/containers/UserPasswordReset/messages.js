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
  fields: {
    password: {
      placeholder: {
        id: 'app.containers.UserPasswordReset.fields.password.placeholder',
        defaultMessage: 'Password',
      },
    },
    passwordConfirmation: {
      placeholder: {
        id: 'app.containers.UserPasswordReset.fields.passwordConfirmation.placeholder',
        defaultMessage: 'Confirm Password',
      },
    },
  },
  submit: {
    id: 'nmrf.containers.UserPasswordReset.submit',
    defaultMessage: 'Reset',
  },
});
