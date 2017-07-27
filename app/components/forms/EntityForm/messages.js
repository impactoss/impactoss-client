/*
 * Form Messages
 *
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  empty: {
    id: 'app.components.EntityForm.empty',
    defaultMessage: 'No {entities} yet. ',
  },
  emptyLink: {
    id: 'app.components.EntityForm.emptyLink',
    defaultMessage: 'Click to select.',
  },
  confirmDeleteQuestion: {
    id: 'app.components.EntityForm.confirmDeleteQuestion',
    defaultMessage: 'Delete forever?',
  },
  buttons: {
    cancelDelete: {
      id: 'app.components.EntityForm.buttons.cancelDelete',
      defaultMessage: 'Cancel',
    },
    confirmDelete: {
      id: 'app.components.EntityForm.buttons.donfirmDelete',
      defaultMessage: 'Delete',
    },
  },
});
