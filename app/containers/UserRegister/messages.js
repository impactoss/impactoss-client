/*
 * UserRegister Messages
 *
 * This contains all the text for the UserRegister component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  pageTitle: {
    id: 'app.container.UserRegister.pageTitle',
    defaultMessage: 'Register',
  },
  metaDescription: {
    id: 'app.container.UserRegister.metaDescription',
    defaultMessage: 'Register User page description',
  },
  header: {
    id: 'app.containers.UserRegister.header',
    defaultMessage: 'Register',
  },
  fieldRequired: {
    id: 'app.containers.UserRegister.header',
    defaultMessage: 'Required',
  },
  fields: {
    name: {
      placeholder: {
        id: 'app.containers.UserRegister.fields.name.placeholder',
        defaultMessage: 'Full name',
      },
    },
    email: {
      placeholder: {
        id: 'app.containers.UserRegister.fields.email.placeholder',
        defaultMessage: 'Email address',
      },
    },
    password: {
      placeholder: {
        id: 'app.containers.UserRegister.fields.password.placeholder',
        defaultMessage: 'Password',
      },
    },
    passwordConfirmation: {
      placeholder: {
        id: 'app.containers.UserRegister.fields.passwordConfirmation.placeholder',
        defaultMessage: 'Confirm Password',
      },
    },
  },
  submit: {
    id: 'nmrf.containers.UserRegister.submit',
    defaultMessage: 'Register',
  },
});
