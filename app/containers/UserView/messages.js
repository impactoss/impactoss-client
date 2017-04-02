/*
 * UserView Messages
 *
 * This contains all the text for the ActionView component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  pageTitle: {
    id: 'app.container.UserView.pageTitle',
    defaultMessage: 'User profile',
  },
  metaDescription: {
    id: 'app.container.UserView.metaDescription',
    defaultMessage: 'User profile page description',
  },
  notFound: {
    id: 'app.containers.UserView.notFound',
    defaultMessage: 'Sorry no user found',
  },
  loading: {
    id: 'app.containers.UserView.loading',
    defaultMessage: 'Loading user...',
  },
});
