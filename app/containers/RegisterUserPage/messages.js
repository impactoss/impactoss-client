/*
 * RegisterUserPage Messages
 *
 * This contains all the text for the RegisterUserPage component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  header: {
    id: 'app.containers.RegisterUserPage.header',
    defaultMessage: 'Register User',
  },
  name: {
    id: 'nmrf.containers.RegisterUserPage.name',
    defaultMessage: 'Full Name',
  },
  email: {
    id: 'nmrf.containers.RegisterUserPage.email',
    defaultMessage: 'Email address',
  },
  password: {
    id: 'nmrf.containers.RegisterUserPage.password',
    defaultMessage: 'Password',
  },
  passwordConfirmation: {
    id: 'nmrf.containers.RegisterUserPage.passwordConfirmation',
    defaultMessage: 'Verify Password',
  },
  submit: {
    id: 'nmrf.containers.RegisterUserPage.submit',
    defaultMessage: 'Register',
  },
});
