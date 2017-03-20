/*
 * ActionView Messages
 *
 * This contains all the text for the ActionView component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  header: {
    id: 'app.containers.CategoryView.header',
    defaultMessage: 'Category',
  },
  notFound: {
    id: 'app.containers.CategoryView.notFound',
    defaultMessage: 'Sorry no category found',
  },
  loading: {
    id: 'app.containers.CategoryView.loading',
    defaultMessage: 'Loading category...',
  },
});
