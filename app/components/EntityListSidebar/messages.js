/*
 * EntityListFilter Messages
 *
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  header: {
    filter: {
      id: 'app.components.EntityListFilters.header.filter',
      defaultMessage: 'Filter List',
    },
    filterButton: {
      id: 'app.components.EntityListFilters.header.filterButton',
      defaultMessage: 'Filter',
    },
    editButton: {
      id: 'app.components.EntityListFilters.header.editButton',
      defaultMessage: 'Edit',
    },
  },
  filterGroupLabel: {
    attributes: {
      id: 'app.components.EntityListFilter.filterGroupLabel.attributes',
      defaultMessage: 'By attribute',
    },
    taxonomies: {
      id: 'app.components.EntityListFilter.filterGroupLabel.taxonomies',
      defaultMessage: 'By category',
    },
    connections: {
      id: 'app.components.EntityListFilter.filterGroupLabel.connections',
      defaultMessage: 'By connection',
    },
    connectedTaxonomies: {
      id: 'app.components.EntityListFilter.filterGroupLabel.connectedTaxonomies',
      defaultMessage: 'By connected category',
    },
  },
  editGroupLabel: {
    attributes: {
      id: 'app.components.EntityListFilter.editGroupLabel.attributes',
      defaultMessage: 'Update attributes',
    },
    taxonomies: {
      id: 'app.components.EntityListFilter.editGroupLabel.taxonomies',
      defaultMessage: 'Update categories',
    },
    connections: {
      id: 'app.components.EntityListFilter.editGroupLabel.connections',
      defaultMessage: 'Update connections',
    },
  },
  filterFormTitlePrefix: {
    id: 'app.components.EntityListFilter.filterFormTitlePrefix',
    defaultMessage: 'Filter by',
  },
  filterFormWithoutPrefix: {
    id: 'app.components.EntityListFilter.filterFormWithoutPrefix',
    defaultMessage: 'Without',
  },
  editFormTitlePrefix: {
    id: 'app.components.EntityListFilter.editFormTitlePrefix',
    defaultMessage: 'Update',
  },
  editFormTitlePostfix: {
    id: 'app.components.EntityListFilter.editFormTitlePostfix',
    defaultMessage: 'selected',
  },
  entitiesNotFound: {
    id: 'app.components.EntityListFilter.entitiesNotFound',
    defaultMessage: 'No entities found',
  },
  entitiesNotSelected: {
    id: 'app.components.EntityListFilter.entitiesNotSelected',
    defaultMessage: 'Please select one or more entities from the list for available edit options',
  },

});
