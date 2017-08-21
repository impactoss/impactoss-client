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
});
