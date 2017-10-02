/*
 * EntityListGroups Messages
 *
 * This contains all the text for the EntityList component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  due: {
    id: 'app.containers.EntityListItem.due',
    defaultMessage: '{total} due',
  },
  overdue: {
    id: 'app.containers.EntityListItem.overdue',
    defaultMessage: '{total} overdue',
  },
});
