/*
 * EntityQuery Messages
 *
 * This contains all the text for the EntityQuery component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  filterGroupLabel: {
    attributes: {
      id: 'app.containers.EntityQuery.filterGroupLabel.attributes',
      defaultMessage: 'By attribute',
    },
    taxonomies: {
      id: 'app.containers.EntityQuery.filterGroupLabel.taxonomies',
      defaultMessage: 'By category',
    },
    connections: {
      id: 'app.containers.EntityQuery.filterGroupLabel.connections',
      defaultMessage: 'By connection',
    },
    connectedTaxonomies: {
      id: 'app.containers.EntityQuery.filterGroupLabel.connectedTaxonomies',
      defaultMessage: 'By connected category',
    },
  },
  editGroupLabel: {
    attributes: {
      id: 'app.containers.EntityQuery.editGroupLabel.attributes',
      defaultMessage: 'Update attributes',
    },
    taxonomies: {
      id: 'app.containers.EntityQuery.editGroupLabel.taxonomies',
      defaultMessage: 'Update categories',
    },
    connections: {
      id: 'app.containers.EntityQuery.editGroupLabel.connections',
      defaultMessage: 'Update connections',
    },
  },
  filterFormTitlePrefix: {
    id: 'app.containers.EntityQuery.filterFormTitlePrefix',
    defaultMessage: 'Filter by',
  },
  filterFormWithoutPrefix: {
    id: 'app.containers.EntityQuery.filterFormWithoutPrefix',
    defaultMessage: 'Without',
  },
  editFormTitlePrefix: {
    id: 'app.containers.EntityQuery.editFormTitlePrefix',
    defaultMessage: 'Update',
  },
  editFormTitlePostfix: {
    id: 'app.containers.EntityQuery.editFormTitlePostfix',
    defaultMessage: 'selected',
  },
});
