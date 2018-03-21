/*
 * Taxonomies Messages
 *
 * This contains all the text for the Taxonomies component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  supTitle: {
    id: 'app.containers.CategoryList.supTitle',
    defaultMessage: 'Categories',
  },
  add: {
    id: 'app.containers.CategoryList.add',
    defaultMessage: 'Add {category}',
  },
  metaDescription: {
    id: 'app.containers.CategoryList.metaDescription',
    defaultMessage: 'Categories overview',
  },
  notFound: {
    id: 'app.containers.CategoryList.notFound',
    defaultMessage: 'Sorry no categories found',
  },
  usersOnly: {
    id: 'app.containers.CategoryList.usersOnly',
    defaultMessage: 'Additional categories applicable to users only',
  },
});
