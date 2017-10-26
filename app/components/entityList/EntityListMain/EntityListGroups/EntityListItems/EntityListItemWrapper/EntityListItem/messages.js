/*
 * EntityListGroups Messages
 *
 * This contains all the text for the EntityList component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  due: {
    id: 'app.components.EntityListItem.due',
    defaultMessage: '{total} due',
  },
  overdue: {
    id: 'app.components.EntityListItem.overdue',
    defaultMessage: '{total} overdue',
  },
});
