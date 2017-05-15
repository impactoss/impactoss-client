/*
 * UserPassword Messages
 *
 * This contains all the text for the UserPassword component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  pageTitle: {
    id: 'app.container.UserPassword.pageTitle',
    defaultMessage: 'Change Password',
  },
  metaDescription: {
    id: 'app.container.UserPassword.metaDescription',
    defaultMessage: 'Change Password page description',
  },
  header: {
    id: 'app.containers.UserPassword.header',
    defaultMessage: 'Change Password',
  },
  fields: {
    password: {
      placeholder: {
        id: 'app.containers.UserPassword.fields.password.placeholder',
        defaultMessage: 'Current password',
      },
    },
    passwordNew: {
      placeholder: {
        id: 'app.containers.UserPassword.fields.passwordNew.placeholder',
        defaultMessage: 'New Password',
      },
    },
    passwordConfirmation: {
      placeholder: {
        id: 'app.containers.UserPassword.fields.passwordConfirmation.placeholder',
        defaultMessage: 'Confirm New Password',
      },
    },
  },
  submit: {
    id: 'nmrf.containers.UserPassword.submit',
    defaultMessage: 'Submit',
  },
});
