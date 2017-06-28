/*
 * EntityListFilter Messages
 *
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  header: {
    filter: {
      id: 'app.containers.EntityListFilters.header.filter',
      defaultMessage: 'Filter List',
    },
    filterButton: {
      id: 'app.containers.EntityListFilters.header.filterButton',
      defaultMessage: 'Filter',
    },
    editButton: {
      id: 'app.containers.EntityListFilters.header.editButton',
      defaultMessage: 'Edit',
    },
  },
  filterGroupLabel: {
    attributes: {
      id: 'app.containers.EntityListFilter.filterGroupLabel.attributes',
      defaultMessage: 'By attribute',
    },
    taxonomies: {
      id: 'app.containers.EntityListFilter.filterGroupLabel.taxonomies',
      defaultMessage: 'By category',
    },
    connections: {
      id: 'app.containers.EntityListFilter.filterGroupLabel.connections',
      defaultMessage: 'By connection',
    },
    connectedTaxonomies: {
      id: 'app.containers.EntityListFilter.filterGroupLabel.connectedTaxonomies',
      defaultMessage: 'By connected category',
    },
  },
  editGroupLabel: {
    attributes: {
      id: 'app.containers.EntityListFilter.editGroupLabel.attributes',
      defaultMessage: 'Update attributes',
    },
    taxonomies: {
      id: 'app.containers.EntityListFilter.editGroupLabel.taxonomies',
      defaultMessage: 'Update categories',
    },
    connections: {
      id: 'app.containers.EntityListFilter.editGroupLabel.connections',
      defaultMessage: 'Update connections',
    },
  },
  filterFormTitlePrefix: {
    id: 'app.containers.EntityListFilter.filterFormTitlePrefix',
    defaultMessage: 'Filter by',
  },
  filterFormWithoutPrefix: {
    id: 'app.containers.EntityListFilter.filterFormWithoutPrefix',
    defaultMessage: 'Without',
  },
  editFormTitlePrefix: {
    id: 'app.containers.EntityListFilter.editFormTitlePrefix',
    defaultMessage: 'Update',
  },
  editFormTitlePostfix: {
    id: 'app.containers.EntityListFilter.editFormTitlePostfix',
    defaultMessage: 'selected',
  },
  entitiesNotFound: {
    id: 'app.containers.EntityListFilter.entitiesNotFound',
    defaultMessage: 'No entities found',
  },
  entitiesNotSelected: {
    id: 'app.containers.EntityListFilter.entitiesNotSelected',
    defaultMessage: 'Please select one or more entities from the list to see the available edit options',
  },

});
