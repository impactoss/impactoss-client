/*
 * EntityListGroups Messages
 *
 * This contains all the text for the EntityList component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  without: {
    id: 'app.containers.EntityListGroups.without',
    defaultMessage: 'Without',
  },
  continued: {
    id: 'app.containers.EntityListGroups.continued',
    defaultMessage: '{label} (continued)',
  },
  draft: {
    id: 'app.containers.EntityListGroups.draft',
    defaultMessage: 'draft',
  },
  listEmpty: {
    id: 'app.containers.EntityListGroups.listEmpty',
    defaultMessage: 'No entities in database',
  },
  listEmptyAfterQuery: {
    id: 'app.containers.EntityListGroups.listEmptyAfterQuery',
    defaultMessage: 'We are sorry, no results matched your search!',
  },
  nestedListEmpty: {
    reports: {
      id: 'app.containers.EntityListGroups.nestedListEmpty.reports',
      defaultMessage: 'No report yet',
    },
    indicatorsExpanded: {
      id: 'app.containers.EntityListGroups.nestedListEmpty.indicatorsExpanded',
      defaultMessage: 'No indicator yet',
    },
  },
  entityListHeader: {
    allSelected: {
      id: 'app.containers.EntityListGroups.entityListHeader.allSelected',
      defaultMessage: 'All {total} {type} selected. ',
    },
    allSelectedOnPage: {
      id: 'app.containers.EntityListGroups.entityListHeader.allSelectedOnPage',
      defaultMessage: 'All {total} {type} on this page are selected. ',
    },
    selected: {
      id: 'app.containers.EntityListGroups.entityListHeader.selected',
      defaultMessage: '{total} {type} selected. ',
    },
    noneSelected: {
      id: 'app.containers.EntityListGroups.entityListHeader.noneSelected',
      defaultMessage: '{type} (showing {pageTotal} of {entitiesTotal} total)',
    },
  },
});
