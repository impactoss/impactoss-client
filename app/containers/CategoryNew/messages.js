/*
 * CategoryNew Messages
 *
 * This contains all the text for the CategoryNew component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  pageTitle: {
    id: 'app.container.CategoryNew.pageTitle',
    defaultMessage: 'New category',
  },
  pageTitleTaxonomy: {
    id: 'app.container.CategoryNew.pageTitleTaxonomy',
    defaultMessage: 'New {taxonomy}',
  },
  metaDescription: {
    id: 'app.container.CategoryNew.metaDescription',
    defaultMessage: 'New Category page description',
  },
  header: {
    id: 'app.containers.CategoryNew.header',
    defaultMessage: 'New Category',
  },
  loading: {
    id: 'app.containers.ActionEdit.loading',
    defaultMessage: 'Loading data...',
  },
  fieldRequired: {
    id: 'app.containers.CategoryNew.header',
    defaultMessage: 'Required',
  },
  fields: {
    title: {
      placeholder: {
        id: 'app.containers.CategoryNew.fields.title.placeholder',
        defaultMessage: 'Enter category title',
      },
    },
  },
});
