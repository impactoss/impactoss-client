/*
 * UserPasswordRecover Messages
 *
 * This contains all the text for the UserPasswordRecover component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  pageTitle: {
    id: 'app.container.UserPasswordRecover.pageTitle',
    defaultMessage: 'Recover password',
  },
  metaDescription: {
    id: 'app.container.UserPasswordRecover.metaDescription',
    defaultMessage: 'Password recover page description',
  },
  header: {
    id: 'nmrf.containers.UserPasswordRecover.header',
    defaultMessage: 'Recover password',
  },
  fieldRequired: {
    id: 'app.containers.UserPasswordRecover.header',
    defaultMessage: 'Required',
  },
  fields: {
    email: {
      placeholder: {
        id: 'app.containers.UserPasswordRecover.fields.email.placeholder',
        defaultMessage: 'Email address',
      },
    },
  },
  submit: {
    id: 'nmrf.containers.UserPasswordRecover.submit',
    defaultMessage: 'Recover',
  },
  loginLink: {
    id: 'app.containers.UserPasswordRecover.loginLink',
    defaultMessage: 'Back to sign in page',
  },
});
