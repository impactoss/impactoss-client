/*
 * EntityListMain Messages
 *
 * This contains all the text for the EntityListMain component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  filterFormWithoutPrefix: {
    id: 'app.components.EntityListMain.filterFormWithoutPrefix',
    defaultMessage: 'Without',
  },
  filterFormError: {
    id: 'app.components.EntityListMain.filterFormError',
    defaultMessage: 'Errors',
  },
  without: {
    id: 'app.components.EntityListMain.without',
    defaultMessage: 'Without {taxonomy}',
  },
  notapplicable: {
    id: 'app.components.EntityListMain.notapplicable',
    defaultMessage: 'Not applicable: {taxonomy}',
  },
  groupSubtitle: {
    id: 'app.components.EntityListMain.groupSubtitle',
    defaultMessage: 'Grouped by {size} {type}',
  },
  printHintKey: {
    id: 'app.components.EntityListMain.printHintKey',
    defaultMessage: 'Please refer to the end of this document for an overview of categories and tags',
  },
});
