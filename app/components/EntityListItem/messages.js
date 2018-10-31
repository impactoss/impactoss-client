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
  associationNotExistent: {
    id: 'app.components.EntityListItem.associationNotExistent',
    defaultMessage: 'Association no longer present.',
  },
  associationAlreadyPresent: {
    id: 'app.components.EntityListItem.associationAlreadyPresent',
    defaultMessage: 'Association already created.',
  },
});
