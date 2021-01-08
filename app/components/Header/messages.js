/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  home: {
    id: 'app.components.Header.home',
    defaultMessage: 'Home',
  },
  login: {
    id: 'app.components.Header.login',
    defaultMessage: 'Sign in',
  },
  logout: {
    id: 'app.components.Header.logout',
    defaultMessage: 'Sign out',
  },
  user: {
    id: 'app.components.Header.user',
    defaultMessage: 'User profile',
  },
  userLoading: {
    id: 'app.components.Header.userLoading',
    defaultMessage: 'Signing in...',
  },
  register: {
    id: 'app.components.Header.register',
    defaultMessage: 'Register',
  },
});
