/*
 * EntityList Messages
 *
 * This contains all the text for the EntityList component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  filterFormWithoutPrefix: {
    id: 'app.containers.EntityList.filterFormWithoutPrefix',
    defaultMessage: 'Without',
  },
  listEmpty: {
    id: 'app.containers.EntityList.listEmpty',
    defaultMessage: 'No entities in database',
  },
  listEmptyAfterQuery: {
    id: 'app.containers.EntityList.listEmptyAfterQuery',
    defaultMessage: 'We are sorry, no results matched your search!',
  },
});
