/*
 * EntityListSidebar Messages
 *
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  header: {
    filter: {
      id: 'app.components.EntityListSidebar.header.filter',
      defaultMessage: 'Filter List',
    },
    filterButton: {
      id: 'app.components.EntityListSidebar.header.filterButton',
      defaultMessage: 'Filter',
    },
    editButton: {
      id: 'app.components.EntityListSidebar.header.editButton',
      defaultMessage: 'Edit',
    },
  },
  groupExpand: {
    show: {
      id: 'app.components.EntityListSidebar.groupExpand.show',
      defaultMessage: 'Show group',
    },
    hide: {
      id: 'app.components.EntityListSidebar.groupExpand.hide',
      defaultMessage: 'Hide group',
    },
  },
  groupOptionSelect: {
    show: {
      id: 'app.components.EntityListSidebar.groupOptionSelect.show',
      defaultMessage: 'Show options',
    },
    hide: {
      id: 'app.components.EntityListSidebar.groupOptionSelect.hide',
      defaultMessage: 'Hide options',
    },
  },
  filterGroupLabel: {
    attributes: {
      id: 'app.components.EntityListSidebar.filterGroupLabel.attributes',
      defaultMessage: 'By attribute',
    },
    taxonomies: {
      id: 'app.components.EntityListSidebar.filterGroupLabel.taxonomies',
      defaultMessage: 'By category',
    },
    connections: {
      id: 'app.components.EntityListSidebar.filterGroupLabel.connections',
      defaultMessage: 'By connection',
    },
    connectedTaxonomies: {
      id: 'app.components.EntityListSidebar.filterGroupLabel.connectedTaxonomies',
      defaultMessage: 'By connected category',
    },
  },
  editGroupLabel: {
    attributes: {
      id: 'app.components.EntityListSidebar.editGroupLabel.attributes',
      defaultMessage: 'Update attributes',
    },
    taxonomies: {
      id: 'app.components.EntityListSidebar.editGroupLabel.taxonomies',
      defaultMessage: 'Update categories',
    },
    connections: {
      id: 'app.components.EntityListSidebar.editGroupLabel.connections',
      defaultMessage: 'Update connections',
    },
  },
  filterFormTitlePrefix: {
    id: 'app.components.EntityListSidebar.filterFormTitlePrefix',
    defaultMessage: 'Filter by',
  },
  filterFormWithoutPrefix: {
    id: 'app.components.EntityListSidebar.filterFormWithoutPrefix',
    defaultMessage: 'Without',
  },
  editFormTitlePrefix: {
    id: 'app.components.EntityListSidebar.editFormTitlePrefix',
    defaultMessage: 'Update',
  },
  editFormTitlePostfix: {
    id: 'app.components.EntityListSidebar.editFormTitlePostfix',
    defaultMessage: 'selected',
  },
  entitiesNotFound: {
    id: 'app.components.EntityListSidebar.entitiesNotFound',
    defaultMessage: 'No entities found',
  },
  entitiesNotSelected: {
    id: 'app.components.EntityListSidebar.entitiesNotSelected',
    defaultMessage: 'Please select one or more entities from the list for available edit options',
  },

});
