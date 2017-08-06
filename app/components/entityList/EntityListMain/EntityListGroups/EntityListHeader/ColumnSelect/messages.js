/*
 * ColumnSelect Messages
 *
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  selectAll: {
    id: 'app.containers.ColumnSelect.selectAll',
    defaultMessage: 'Select all {number}.',
  },
  sortAttributes: {
    id: {
      id: 'app.containers.ColumnSelect.sortAttributes.id',
      defaultMessage: 'Created at',
    },
    reference: {
      id: 'app.containers.ColumnSelect.sortAttributes.id',
      defaultMessage: 'Reference',
    },
    title: {
      id: 'app.containers.ColumnSelect.sortAttributes.title',
      defaultMessage: 'Title',
    },
    name: {
      id: 'app.containers.ColumnSelect.sortAttributes.title',
      defaultMessage: 'Name',
    },
    updated_at: {
      id: 'app.containers.ColumnSelect.sortAttributes.updated_at',
      defaultMessage: 'Updated at',
    },
    order: {
      id: 'app.containers.ColumnSelect.sortAttributes.order',
      defaultMessage: 'Menu order',
    },
  },
});
