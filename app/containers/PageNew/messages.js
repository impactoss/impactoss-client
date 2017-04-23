/*
 * PageNew Messages
 *
 * This contains all the text for the PageNew component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  pageTitle: {
    id: 'app.container.PageNew.pageTitle',
    defaultMessage: 'New Page',
  },
  metaDescription: {
    id: 'app.container.PageNew.metaDescription',
    defaultMessage: 'New Page page description',
  },
  header: {
    id: 'app.containers.PageNew.header',
    defaultMessage: 'New Page',
  },
  loading: {
    id: 'app.containers.PageNew.loading',
    defaultMessage: 'Loading data...',
  },
  fieldRequired: {
    id: 'app.containers.PageNew.header',
    defaultMessage: 'Required',
  },
  fields: {
    title: {
      placeholder: {
        id: 'app.containers.PageNew.fields.title.placeholder',
        defaultMessage: 'Enter page title',
      },
    },
  },
});
