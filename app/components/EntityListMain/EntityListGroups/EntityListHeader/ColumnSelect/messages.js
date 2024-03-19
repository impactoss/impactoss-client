/*
 * ColumnSelect Messages
 *
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  selectAll: {
    id: 'app.components.ColumnSelect.selectAll',
    defaultMessage: 'Select all {number} items in list.',
  },
  selectAllTitle: {
    id: 'app.components.ColumnSelect.selectAllTitle',
    defaultMessage: 'Select all {number} items in list.',
  },
  selectAllOnPage: {
    id: 'app.components.ColumnSelect.selectAllOnPage',
    defaultMessage: 'Click to select all items on page.',
  },
  unselectAll: {
    id: 'app.components.ColumnSelect.unselectAll',
    defaultMessage: 'Uncheck to unselect all selected items',
  },
  sortSelectLabel: {
    id: 'app.components.ColumnSelect.sortSelectLabel',
    defaultMessage: 'Sorted by',
  },
  sortOrderAsc: {
    id: 'app.components.ColumnSelect.sortOrderAsc',
    defaultMessage: 'Sort order ascending - click to reverse',
  },
  sortOrderDesc: {
    id: 'app.components.ColumnSelect.sortOrderDesc',
    defaultMessage: 'Sort order descending - click to reverse',
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
    target_date: {
      id: 'app.components.ColumnSelect.sortAttributes.target_date',
      defaultMessage: 'Target date',
    },
  },
});
