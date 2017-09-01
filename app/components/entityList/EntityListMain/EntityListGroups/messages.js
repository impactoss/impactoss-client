/*
 * EntityListGroups Messages
 *
 * This contains all the text for the EntityList component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
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
      defaultMessage: 'No reports present',
    },
    indicatorsExpanded: {
      id: 'app.containers.EntityListGroups.nestedListEmpty.indicatorsExpanded',
      defaultMessage: 'No indicators present',
    },
  },
});
