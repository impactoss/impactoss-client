/*
 * EntityListGroups Messages
 *
 * This contains all the text for the EntityList component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  without: {
    id: 'app.components.EntityListGroups.without',
    defaultMessage: 'Without',
  },
  continued: {
    id: 'app.components.EntityListGroups.continued',
    defaultMessage: '{label} (continued)',
  },
  draft: {
    id: 'app.components.EntityListGroups.draft',
    defaultMessage: 'draft',
  },
  listEmpty: {
    id: 'app.components.EntityListGroups.listEmpty',
    defaultMessage: 'No entities in database',
  },
  listEmptyAfterQuery: {
    id: 'app.components.EntityListGroups.listEmptyAfterQuery',
    defaultMessage: 'We are sorry, no results matched your search',
  },
  listEmptyAfterQueryAndErrors: {
    id: 'app.components.EntityListGroups.listEmptyAfterQueryAndErrors',
    defaultMessage: 'Some errors are hidden by current filter settings. Please remove your filters to see all errors.',
  },
  entityNoLongerPresent: {
    id: 'app.components.EntityListGroups.entityNoLongerPresent',
    defaultMessage: 'Item with database id \'{entityId}\' no longer exists.',
  },
  nestedListEmpty: {
    reports: {
      id: 'app.components.EntityListGroups.nestedListEmpty.reports',
      defaultMessage: 'No report yet',
    },
    indicatorsExpanded: {
      id: 'app.components.EntityListGroups.nestedListEmpty.indicatorsExpanded',
      defaultMessage: 'No indicator yet',
    },
  },
  entityListHeader: {
    allSelected: {
      id: 'app.components.EntityListGroups.entityListHeader.allSelected',
      defaultMessage: 'All {total} {type} selected. ',
    },
    allSelectedOnPage: {
      id: 'app.components.EntityListGroups.entityListHeader.allSelectedOnPage',
      defaultMessage: 'All {total} {type} on this page are selected. ',
    },
    selected: {
      id: 'app.components.EntityListGroups.entityListHeader.selected',
      defaultMessage: '{total} {type} selected. ',
    },
    noneSelected: {
      id: 'app.components.EntityListGroups.entityListHeader.noneSelected',
      defaultMessage: '{type} (showing {pageTotal} of {entitiesTotal} total)',
    },
    notPaged: {
      id: 'app.components.EntityListGroups.entityListHeader.notPaged',
      defaultMessage: '{entitiesTotal} {type}',
    },
  },
});
