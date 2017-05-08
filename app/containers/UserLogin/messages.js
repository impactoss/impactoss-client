/*
 * UserLogin Messages
 *
 * This contains all the text for the UserLogin component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  pageTitle: {
    id: 'app.container.UserLogin.pageTitle',
    defaultMessage: 'Login',
  },
  metaDescription: {
    id: 'app.container.UserLogin.metaDescription',
    defaultMessage: 'Login User page description',
  },
  header: {
    id: 'nmrf.containers.UserLogin.header',
    defaultMessage: 'Login',
  },
  fieldRequired: {
    id: 'app.containers.UserLogin.header',
    defaultMessage: 'Required',
  },
  resetPasswordLink: {
    id: 'app.containers.UserLogin.resetPasswordLink',
    defaultMessage: 'Reset password',
  },
  fields: {
    email: {
      placeholder: {
        id: 'app.containers.UserLogin.fields.email.placeholder',
        defaultMessage: 'Email address',
      },
    },
    password: {
      placeholder: {
        id: 'app.containers.UserLogin.fields.password.placeholder',
        defaultMessage: 'Password',
      },
    },
  },
  submit: {
    id: 'nmrf.containers.UserLogin.submit',
    defaultMessage: 'Log in',
  },
});
