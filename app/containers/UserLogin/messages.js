/*
 * UserLogin Messages
 *
 * This contains all the text for the UserLogin component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  pageTitle: {
    id: 'app.container.UserLogin.pageTitle',
    defaultMessage: 'Sign in',
  },
  metaDescription: {
    id: 'app.container.UserLogin.metaDescription',
    defaultMessage: 'Sign in page description',
  },
  header: {
    id: 'nmrf.containers.UserLogin.header',
    defaultMessage: 'Sign in',
  },
  registerLinkBefore: {
    id: 'app.containers.UserLogin.registerLinkBefore',
    defaultMessage: 'Do not have an account? ',
  },
  registerLink: {
    id: 'app.containers.UserLogin.registerLink',
    defaultMessage: 'Register here',
  },
  recoverPasswordLink: {
    id: 'app.containers.UserLogin.recoverPasswordLink',
    defaultMessage: 'I forgot my password',
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
    defaultMessage: 'Sign in',
  },
});
