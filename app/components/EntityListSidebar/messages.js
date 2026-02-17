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
    filterMode: {
      id: 'app.components.EntityListSidebar.header.filterMode',
      defaultMessage: 'Filter mode active.',
    },
    editMode: {
      id: 'app.components.EntityListSidebar.header.editMode',
      defaultMessage: 'Edit mode active. {count} items selected. Edit options available.',
    },
    editModeNoneSelected: {
      id: 'app.components.EntityListSidebar.header.editModeNoneSelected',
      defaultMessage: 'Edit mode active. Please select one or more entities from the list for available edit options.',
    },
  },
  sidebarToggle: {
    showFilter: {
      id: 'app.components.EntityListSidebar.sidebarToggle.showFilter',
      defaultMessage: 'Show filter options',
    },
    showFilterEdit: {
      id: 'app.components.EntityListSidebar.sidebarToggle.showFilterEdit',
      defaultMessage: 'Show filter & edit options',
    },
    hide: {
      id: 'app.components.EntityListSidebar.sidebarToggle.hide',
      defaultMessage: 'Hide options',
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
    frameworks: {
      id: 'app.components.EntityListSidebar.filterGroupLabel.frameworks',
      defaultMessage: 'By framework',
    },
    taxonomies: {
      id: 'app.components.EntityListSidebar.filterGroupLabel.taxonomies',
      defaultMessage: 'By category',
    },
    taxonomiesByFw: {
      id: 'app.components.EntityListSidebar.filterGroupLabel.taxonomiesByFw',
      defaultMessage: 'By category ({fw})',
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
