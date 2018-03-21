/*
 * ColumnSelect Messages
 *
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  selectAll: {
    id: 'app.components.ColumnSelect.selectAll',
    defaultMessage: 'Select all {number}.',
  },
  sortAttributes: {
    id: {
      id: 'app.components.ColumnSelect.sortAttributes.id',
      defaultMessage: 'Created at',
    },
    reference: {
      id: 'app.components.ColumnSelect.sortAttributes.reference',
      defaultMessage: 'Reference',
    },
    title: {
      id: 'app.components.ColumnSelect.sortAttributes.title',
      defaultMessage: 'Title',
    },
    name: {
      id: 'app.components.ColumnSelect.sortAttributes.name',
      defaultMessage: 'Name',
    },
    updated_at: {
      id: 'app.components.ColumnSelect.sortAttributes.updated_at',
      defaultMessage: 'Updated at',
    },
    order: {
      id: 'app.components.ColumnSelect.sortAttributes.order',
      defaultMessage: 'Menu order',
    },
  },
});
